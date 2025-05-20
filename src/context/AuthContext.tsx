
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Types
export type UserRole = 'voter' | 'admin' | 'super_admin';

export interface AdminPermissions {
  canCreateElections: boolean;
  canEditElections: boolean;
  canDeleteElections: boolean;
  canManageVoters: boolean;
  canManageAdmins: boolean;
  canViewLogs: boolean;
  canChangeSettings: boolean;
}

export interface User {
  id: string;
  role: UserRole;
  email?: string;
  name?: string;
  permissions?: AdminPermissions;
  electionId?: string; // For voters, to know which election they're voting in
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (codeOrCredentials: string | { email: string; password: string }, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  session: Session | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        
        if (newSession) {
          // Get user metadata and role
          const userRole = newSession.user?.user_metadata?.role || 'voter';
          
          let userData: User = {
            id: newSession.user.id,
            role: userRole,
            email: newSession.user.email || undefined,
            name: newSession.user?.user_metadata?.name,
          };
          
          // For admin users, add permissions
          if (userRole === 'admin' || userRole === 'super_admin') {
            userData.permissions = {
              canCreateElections: true,
              canEditElections: true,
              canDeleteElections: userRole === 'super_admin',
              canManageVoters: true,
              canManageAdmins: userRole === 'super_admin',
              canViewLogs: true,
              canChangeSettings: userRole === 'super_admin'
            };
          }
          
          // For voter users, check if they have an election ID
          if (userRole === 'voter' && newSession.user?.user_metadata?.electionId) {
            userData.electionId = newSession.user.user_metadata.electionId;
          }
          
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession) {
        // Get user metadata and role
        const userRole = currentSession.user?.user_metadata?.role || 'voter';
        
        let userData: User = {
          id: currentSession.user.id,
          role: userRole,
          email: currentSession.user.email || undefined,
          name: currentSession.user?.user_metadata?.name,
        };
        
        // For admin users, add permissions
        if (userRole === 'admin' || userRole === 'super_admin') {
          userData.permissions = {
            canCreateElections: true,
            canEditElections: true,
            canDeleteElections: userRole === 'super_admin',
            canManageVoters: true,
            canManageAdmins: userRole === 'super_admin',
            canViewLogs: true,
            canChangeSettings: userRole === 'super_admin'
          };
        }
        
        // For voter users, check if they have an election ID
        if (userRole === 'voter' && currentSession.user?.user_metadata?.electionId) {
          userData.electionId = currentSession.user.user_metadata.electionId;
        }
        
        setUser(userData);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    codeOrCredentials: string | { email: string; password: string }, 
    isAdmin = false
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (typeof codeOrCredentials === 'string') {
        // Voter login with one-time code
        const { data: voters, error } = await supabase
          .from('voters')
          .select('id, election_id, has_voted')
          .eq('one_time_code', codeOrCredentials)
          .eq('has_voted', false)
          .single();
        
        if (error || !voters) {
          console.error("Voter login error:", error);
          return false;
        }
        
        // Sign in anonymously with metadata
        const { error: signInError } = await supabase.auth.signInAnonymously({
          options: {
            data: {
              role: 'voter',
              electionId: voters.election_id,
              voterId: voters.id
            }
          }
        });
        
        if (signInError) {
          console.error("Anonymous sign in error:", signInError);
          return false;
        }
        
        return true;
      } else {
        // Admin login with email/password
        const { email, password } = codeOrCredentials;
        
        // Email/password login for admins
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error || !data.user) {
          console.error("Admin login error:", error);
          return false;
        }
        
        // Log admin login
        if (data.user) {
          const { error: logError } = await supabase
            .from('logs')
            .insert({
              admin_id: data.user.id,
              admin_name: data.user.email || 'Admin',
              action: 'LOGIN',
              details: `Admin user ${data.user.email} logged in`
            });
          
          if (logError) {
            console.error("Error logging admin login:", logError);
            // Don't fail the login just because logging failed
          }
        }
        
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (user && (user.role === 'admin' || user.role === 'super_admin') && session) {
      // Log admin logout
      try {
        const { error } = await supabase
          .from('logs')
          .insert({
            admin_id: user.id,
            admin_name: user.name || user.email || 'Admin',
            action: 'LOGOUT',
            details: `Admin user ${user.name || user.email || 'Admin'} logged out`
          });
        
        if (error) {
          console.error("Error logging admin logout:", error);
        }
      } catch (error) {
        console.error('Error logging logout:', error);
      }
    }
    
    // Sign out from Supabase
    await supabase.auth.signOut();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

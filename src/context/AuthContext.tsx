
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthUser, UserRole } from '@/services/types';
import { useVoterAuth } from '@/hooks/useVoterAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { logService } from '@/services/logService';

// Context type
interface AuthContextType {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authenticateVoter } = useVoterAuth();
  const { loginAdmin, logoutAdmin } = useAdminAuth();

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        
        if (newSession) {
          // Get user metadata and role
          const userMeta = newSession.user?.user_metadata;
          const userRole = userMeta?.role || 'voter';
          
          let userData: AuthUser = {
            id: newSession.user.id,
            role: userRole as UserRole,
            email: newSession.user.email || undefined,
            name: userMeta?.name as string | undefined,
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
          if (userRole === 'voter' && userMeta?.electionId) {
            userData.electionId = userMeta.electionId as string;
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
        const userMeta = currentSession.user?.user_metadata;
        const userRole = userMeta?.role || 'voter';
        
        let userData: AuthUser = {
          id: currentSession.user.id,
          role: userRole as UserRole,
          email: currentSession.user.email || undefined,
          name: userMeta?.name as string | undefined,
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
        if (userRole === 'voter' && userMeta?.electionId) {
          userData.electionId = userMeta.electionId as string;
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
        const result = await authenticateVoter(codeOrCredentials);
        
        if (!result.success) {
          return false;
        }
        
        // Sign in anonymously with metadata
        const { error: signInError } = await supabase.auth.signInAnonymously({
          options: {
            data: {
              role: 'voter',
              electionId: result.electionId,
              voterId: result.voterId
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
        return await loginAdmin(email, password);
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      await logoutAdmin(user.id, user.name || user.email || 'Admin');
    } else {
      // Just sign out for voters
      await supabase.auth.signOut();
    }
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

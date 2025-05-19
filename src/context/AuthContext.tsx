
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticateAdmin } from '@/services/auth';
import { api } from '@/services/api';

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
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    codeOrCredentials: string | { email: string; password: string }, 
    isAdmin = false
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (typeof codeOrCredentials === 'string') {
        // Voter login with one-time code
        const result = await api.validateVoterCode(codeOrCredentials);
        
        if (result.valid && result.voterId && result.electionId) {
          // Successful voter login
          const userData: User = {
            id: result.voterId,
            role: 'voter',
            electionId: result.electionId
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          return true;
        }
        return false;
      } else {
        // Admin login with email/password
        const { email, password } = codeOrCredentials;
        const adminUser = await authenticateAdmin(email, password);
        
        if (adminUser) {
          // Log successful admin login
          await api.addLog(
            adminUser.id, 
            adminUser.name, 
            'LOGIN', 
            `Admin user ${adminUser.name} logged in`
          );
          
          localStorage.setItem('user', JSON.stringify(adminUser));
          setUser(adminUser);
          return true;
        }
        return false;
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
      // Log admin logout
      try {
        await api.addLog(
          user.id, 
          user.name || 'Admin', 
          'LOGOUT', 
          `Admin user ${user.name || 'Admin'} logged out`
        );
      } catch (error) {
        console.error('Error logging logout:', error);
      }
    }
    
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
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

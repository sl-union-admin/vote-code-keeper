
import React, { createContext, useState, useContext, useEffect } from 'react';

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
      // In a real app, this would be an API call to verify the code or credentials
      let userData: User;
      
      if (typeof codeOrCredentials === 'string') {
        // Voter login with one-time code
        // Mocking a successful login response for demo purposes
        userData = {
          id: 'v_' + Math.random().toString(36).substr(2, 9),
          role: 'voter',
        };
      } else {
        // Admin login with email/password from environment variables
        const { email, password } = codeOrCredentials;
        
        // Check if the email and password match the admin credentials defined in the environment
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'SecurePassword123!';
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com';
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperSecurePassword456!';
        
        if (email === adminEmail && password === adminPassword) {
          userData = {
            id: 'a_' + Math.random().toString(36).substr(2, 9),
            role: 'admin',
            email: email,
            name: 'Admin User',
            permissions: {
              canCreateElections: true,
              canEditElections: true,
              canDeleteElections: false,
              canManageVoters: true,
              canManageAdmins: false,
              canViewLogs: true,
              canChangeSettings: false,
            }
          };
        } else if (email === superAdminEmail && password === superAdminPassword) {
          userData = {
            id: 'sa_' + Math.random().toString(36).substr(2, 9),
            role: 'super_admin',
            email: email,
            name: 'Super Admin',
            permissions: {
              canCreateElections: true,
              canEditElections: true,
              canDeleteElections: true,
              canManageVoters: true,
              canManageAdmins: true,
              canViewLogs: true,
              canChangeSettings: true,
            }
          };
        } else {
          return false;
        }
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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

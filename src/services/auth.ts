
// In a real application, this service would handle JWT tokens, session management, etc.
// For this demo, we'll use localStorage for simplicity

// Types from the auth context
import { User } from '../context/AuthContext';

export const authService = {
  // Store user data in localStorage
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Get user data from localStorage
  getUser: (): User | null => {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  },
  
  // Clear user data from localStorage
  clearUser: () => {
    localStorage.removeItem('user');
  },
  
  // Verify voter one-time code
  verifyVoterCode: async (code: string): Promise<User | null> => {
    // In a real app, this would make an API call to verify the code
    // For demo purposes, we'll simulate a successful verification for any 6-digit code
    if (/^\d{6}$/.test(code)) {
      return {
        id: 'v_' + Math.random().toString(36).substr(2, 9),
        role: 'voter'
      };
    }
    return null;
  },
  
  // Verify admin credentials
  verifyAdminCredentials: async (email: string, password: string): Promise<User | null> => {
    // In a real app, this would make an API call to verify the credentials
    // For demo purposes, we'll simulate successful logins for specific emails
    if (email === 'admin@example.com' && password === 'password') {
      return {
        id: 'a_' + Math.random().toString(36).substr(2, 9),
        role: 'admin',
        email,
        name: 'Admin User',
        permissions: {
          canCreateElections: true,
          canEditElections: true,
          canDeleteElections: false,
          canManageVoters: true,
          canManageAdmins: false,
          canViewLogs: true,
          canChangeSettings: false
        }
      };
    } else if (email === 'superadmin@example.com' && password === 'password') {
      return {
        id: 'sa_' + Math.random().toString(36).substr(2, 9),
        role: 'super_admin',
        email,
        name: 'Super Admin',
        permissions: {
          canCreateElections: true,
          canEditElections: true,
          canDeleteElections: true,
          canManageVoters: true,
          canManageAdmins: true,
          canViewLogs: true,
          canChangeSettings: true
        }
      };
    }
    return null;
  },
  
  // Request password reset
  requestPasswordReset: async (email: string): Promise<boolean> => {
    // In a real app, this would send an email with a reset link
    // For demo purposes, we'll simulate a successful request for any email
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });
  }
};

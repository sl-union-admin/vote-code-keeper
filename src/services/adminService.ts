
import { AdminUser } from './types';

// Since there's no admins table in the database, we'll implement this as a mock service
export const adminService = {
  // Mock implementation for getAdmins
  getAdmins: async (): Promise<AdminUser[]> => {
    // In a real implementation, this would fetch from Supabase
    // For now, return some mock data
    return [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        permissions: {
          canCreateElections: true,
          canEditElections: true,
          canDeleteElections: false,
          canManageVoters: true,
          canManageAdmins: false,
          canViewLogs: true,
          canChangeSettings: false,
        }
      },
      {
        id: '2',
        name: 'Super Admin',
        email: 'super@example.com',
        role: 'super_admin',
        permissions: {
          canCreateElections: true,
          canEditElections: true,
          canDeleteElections: true,
          canManageVoters: true,
          canManageAdmins: true,
          canViewLogs: true,
          canChangeSettings: true,
        }
      }
    ];
  }
};

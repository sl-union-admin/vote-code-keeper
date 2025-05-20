
import { AdminUser } from './types';

// In-memory storage for admins until we connect to a real backend
const admins: AdminUser[] = [];

export const adminService = {
  getAdmins: async (): Promise<AdminUser[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...admins]), 300);
    });
  },
  
  addAdmin: async (admin: Omit<AdminUser, 'id'>): Promise<AdminUser> => {
    const newAdmin = {
      ...admin,
      id: 'admin-' + Date.now(),
    };
    admins.push(newAdmin);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newAdmin), 300);
    });
  },
  
  updateAdmin: async (id: string, updates: Partial<AdminUser>): Promise<AdminUser | undefined> => {
    const index = admins.findIndex(a => a.id === id);
    if (index !== -1) {
      admins[index] = { ...admins[index], ...updates };
      return new Promise((resolve) => {
        setTimeout(() => resolve(admins[index]), 300);
      });
    }
    return undefined;
  },
};


import { AdminUser } from './types';
import { mockAdmins } from './mockData';

export const adminService = {
  getAdmins: async (): Promise<AdminUser[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockAdmins]), 300);
    });
  },
  
  addAdmin: async (admin: Omit<AdminUser, 'id'>): Promise<AdminUser> => {
    const newAdmin = {
      ...admin,
      id: 'admin-' + Date.now(),
    };
    mockAdmins.push(newAdmin);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newAdmin), 300);
    });
  },
  
  updateAdmin: async (id: string, updates: Partial<AdminUser>): Promise<AdminUser | undefined> => {
    const index = mockAdmins.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAdmins[index] = { ...mockAdmins[index], ...updates };
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockAdmins[index]), 300);
      });
    }
    return undefined;
  },
};

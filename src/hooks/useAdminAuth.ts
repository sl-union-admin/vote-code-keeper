
import { useState } from 'react';
import { loginAdmin, logoutAdmin } from '@/services/auth';

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginAdminUser = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Use our mock auth method for admins
      const success = await loginAdmin(email, password);
      return success;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdminUser = async (userId: string, userName: string) => {
    // Log admin logout using our mock method
    await logoutAdmin(userId, userName);
  };

  return {
    isLoading,
    loginAdmin: loginAdminUser,
    logoutAdmin: logoutAdminUser
  };
};

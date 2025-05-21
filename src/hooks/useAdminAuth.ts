
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
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
      try {
        await supabase
          .from('logs')
          .insert({
            admin_id: data.user.id,
            admin_name: data.user.email || 'Admin',
            action: 'LOGIN',
            details: `Admin user ${data.user.email} logged in`
          });
      } catch (error) {
        console.error("Error logging admin login:", error);
        // Don't fail the login just because logging failed
      }
      
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async (userId: string, userName: string) => {
    // Log admin logout
    try {
      await supabase
        .from('logs')
        .insert({
          admin_id: userId,
          admin_name: userName || 'Admin',
          action: 'LOGOUT',
          details: `Admin user ${userName || 'Admin'} logged out`
        });
    } catch (error) {
      console.error('Error logging logout:', error);
    }
    
    // Sign out from Supabase
    await supabase.auth.signOut();
  };

  return {
    isLoading,
    loginAdmin,
    logoutAdmin
  };
};

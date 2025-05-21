
import { supabase } from '@/integrations/supabase/client';

export const logService = {
  addLog: async (adminId: string, adminName: string, action: string, details: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('logs')
        .insert({
          admin_id: adminId,
          admin_name: adminName,
          action,
          details
        });
      
      if (error) {
        console.error('Error adding log:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error adding log:', error);
      return false;
    }
  }
};

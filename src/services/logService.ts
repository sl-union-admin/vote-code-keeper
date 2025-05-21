
import { supabase } from '@/integrations/supabase/client';
import { LogEntry } from './types';
import { mapLogEntry } from './mappingUtils';

export const logService = {
  addLog: async (admin_id: string, admin_name: string, action: string, details: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('logs')
        .insert({
          admin_id,
          admin_name,
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
  },
  
  getLogs: async (): Promise<LogEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching logs:', error);
        return [];
      }
      
      return data.map(mapLogEntry) || [];
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  }
};

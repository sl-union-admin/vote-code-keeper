
import { supabase } from '@/integrations/supabase/client';
import { LogEntry } from './types';

export const logService = {
  getLogs: async (): Promise<LogEntry[]> => {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
    
    return data || [];
  },
  
  addLog: async (adminId: string, adminName: string, action: string, details: string): Promise<LogEntry> => {
    const newLog = {
      admin_id: adminId,
      admin_name: adminName,
      action,
      details
    };
    
    const { data, error } = await supabase
      .from('logs')
      .insert([newLog])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding log:', error);
      throw error;
    }
    
    return data;
  },
};

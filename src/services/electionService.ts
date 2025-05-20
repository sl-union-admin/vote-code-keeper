
import { supabase } from '@/integrations/supabase/client';
import { Election } from './types';

export const electionService = {
  getElections: async (): Promise<Election[]> => {
    const { data, error } = await supabase
      .from('elections')
      .select('*');
      
    if (error) {
      console.error('Error fetching elections:', error);
      return [];
    }
    
    return data || [];
  },
  
  getElection: async (id: string): Promise<Election | undefined> => {
    const { data, error } = await supabase
      .from('elections')
      .select('*, candidates(*)')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching election ${id}:`, error);
      return undefined;
    }
    
    return data;
  },
  
  createElection: async (election: Omit<Election, 'id'>): Promise<Election> => {
    const { data, error } = await supabase
      .from('elections')
      .insert([election])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating election:', error);
      throw error;
    }
    
    return data;
  },
  
  updateElection: async (id: string, updates: Partial<Election>): Promise<Election | undefined> => {
    const { data, error } = await supabase
      .from('elections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating election ${id}:`, error);
      return undefined;
    }
    
    return data;
  },
  
  deleteElection: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('elections')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting election ${id}:`, error);
      return false;
    }
    
    return true;
  },
};

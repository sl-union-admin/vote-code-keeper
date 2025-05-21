
import { supabase } from '@/integrations/supabase/client';
import { Election } from './types';
import { mapElection } from './mappingUtils';

export const electionService = {
  getElections: async (): Promise<Election[]> => {
    const { data, error } = await supabase
      .from('elections')
      .select('*, candidates(*)');
      
    if (error) {
      console.error('Error fetching elections:', error);
      return [];
    }
    
    return data.map(mapElection) || [];
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
    
    return mapElection(data);
  },
  
  createElection: async (election: Omit<Election, 'id' | 'candidates' | 'created_at'>): Promise<Election> => {
    const { data, error } = await supabase
      .from('elections')
      .insert([election])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating election:', error);
      throw error;
    }
    
    return mapElection(data);
  },
  
  updateElection: async (id: string, updates: Partial<Omit<Election, 'id' | 'candidates' | 'created_at'>>): Promise<Election | undefined> => {
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
    
    return mapElection(data);
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


import { supabase } from '@/integrations/supabase/client';
import { Election } from './types';
import { mapElection } from './mappingUtils';
import { convertToSnakeCase } from '@/utils/typeUtils';

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
    // Convert camelCase to snake_case for proper database field mapping
    const dbElection = {
      title: election.title,
      description: election.description,
      start_date: election.start_date,
      end_date: election.end_date,
      is_active: election.is_active
    };
    
    const { data, error } = await supabase
      .from('elections')
      .insert([dbElection])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating election:', error);
      throw error;
    }
    
    return mapElection(data);
  },
  
  updateElection: async (id: string, updates: Partial<Omit<Election, 'id' | 'candidates' | 'created_at'>>): Promise<Election | undefined> => {
    // Convert camelCase to snake_case for proper database field mapping
    const dbUpdates = {};
    if (updates.title !== undefined) dbUpdates['title'] = updates.title;
    if (updates.description !== undefined) dbUpdates['description'] = updates.description;
    if (updates.start_date !== undefined) dbUpdates['start_date'] = updates.start_date;
    if (updates.end_date !== undefined) dbUpdates['end_date'] = updates.end_date;
    if (updates.is_active !== undefined) dbUpdates['is_active'] = updates.is_active;
    
    const { data, error } = await supabase
      .from('elections')
      .update(dbUpdates)
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

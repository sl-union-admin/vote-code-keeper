
import { supabase } from '@/integrations/supabase/client';
import { Voter } from './types';

export const voterService = {
  getVoters: async (): Promise<Voter[]> => {
    const { data, error } = await supabase
      .from('voters')
      .select('*');
      
    if (error) {
      console.error('Error fetching voters:', error);
      return [];
    }
    
    return data || [];
  },
  
  getVotersByElection: async (electionId: string): Promise<Voter[]> => {
    const { data, error } = await supabase
      .from('voters')
      .select('*')
      .eq('election_id', electionId);
      
    if (error) {
      console.error(`Error fetching voters for election ${electionId}:`, error);
      return [];
    }
    
    return data || [];
  },
  
  addVoter: async (electionId: string): Promise<Voter> => {
    const oneTimeCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const { data, error } = await supabase
      .from('voters')
      .insert([{
        election_id: electionId,
        one_time_code: oneTimeCode,
        has_voted: false,
        shared: false
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding voter:', error);
      throw error;
    }
    
    return data;
  },
  
  deleteVoter: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('voters')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting voter ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  generateCodes: async (count: number, electionId: string): Promise<string[]> => {
    const codes: string[] = [];
    const voters: Array<{election_id: string, one_time_code: string, has_voted: boolean, shared: boolean}> = [];
    
    // Generate unique codes
    for (let i = 0; i < count; i++) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      codes.push(code);
      voters.push({
        election_id: electionId,
        one_time_code: code,
        has_voted: false,
        shared: false
      });
    }
    
    // Insert all voters at once
    const { error } = await supabase
      .from('voters')
      .insert(voters);
      
    if (error) {
      console.error('Error generating voter codes:', error);
      return [];
    }
    
    return codes;
  },
  
  regenerateCode: async (id: string): Promise<string> => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const { data, error } = await supabase
      .from('voters')
      .update({ one_time_code: newCode, shared: false })
      .eq('id', id)
      .select('one_time_code')
      .single();
      
    if (error) {
      console.error(`Error regenerating code for voter ${id}:`, error);
      return '';
    }
    
    return data?.one_time_code || '';
  },
  
  toggleSharedStatus: async (id: string, shared: boolean): Promise<boolean> => {
    const { error } = await supabase
      .from('voters')
      .update({ shared })
      .eq('id', id);
      
    if (error) {
      console.error(`Error toggling shared status for voter ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  validateVoterCode: async (code: string): Promise<{ valid: boolean; voterId: string | null; electionId: string | null }> => {
    const { data, error } = await supabase
      .from('voters')
      .select('id, election_id')
      .eq('one_time_code', code)
      .eq('has_voted', false)
      .single();
      
    if (error || !data) {
      console.error('Error validating voter code:', error);
      return { valid: false, voterId: null, electionId: null };
    }
    
    return {
      valid: true,
      voterId: data.id,
      electionId: data.election_id
    };
  },
};

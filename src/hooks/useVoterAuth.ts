
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapVoter } from '@/services/mappingUtils';

export const useVoterAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const authenticateVoter = async (code: string): Promise<{
    success: boolean;
    voterId?: string;
    electionId?: string;
  }> => {
    setIsLoading(true);
    
    try {
      // Query the voters table for the one-time code
      const { data, error } = await supabase
        .from('voters')
        .select('id, election_id, has_voted')
        .eq('one_time_code', code)
        .eq('has_voted', false)
        .single();
      
      if (error || !data) {
        console.error("Voter login error:", error);
        return { success: false };
      }
      
      // Map the voter data
      const voter = mapVoter(data);
      
      return {
        success: true,
        voterId: voter.id,
        electionId: voter.election_id
      };
    } catch (error) {
      console.error("Voter authentication error:", error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    authenticateVoter
  };
};

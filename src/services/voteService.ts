
import { supabase } from '@/integrations/supabase/client';

export const voteService = {
  castVote: async (electionId: string, candidateId: string, voterId: string): Promise<boolean> => {
    // Call the increment_vote function to update candidate vote count
    const { error: candidateError } = await supabase.rpc('increment_vote', {
      candidate_id_param: candidateId
    });
    
    if (candidateError) {
      console.error(`Error incrementing vote count for candidate ${candidateId}:`, candidateError);
      return false;
    }
    
    // Mark the voter as having voted
    const { error: voterError } = await supabase
      .from('voters')
      .update({ has_voted: true })
      .eq('id', voterId);
      
    if (voterError) {
      console.error(`Error marking voter ${voterId} as voted:`, voterError);
      // Note: We'd ideally want to roll back the candidate vote count update here,
      // but without true transactions that's difficult. In a production app, 
      // you'd want to handle this case better.
      return false;
    }
    
    return true;
  }
};

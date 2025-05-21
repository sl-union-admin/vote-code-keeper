
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Candidate } from '@/services/types';

export const useVoting = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [voteCast, setVoteCast] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };
  
  const handleVote = async () => {
    if (!selectedCandidate || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the voter ID from user metadata
      const voterId = user.id;
      
      // Call the RPC function to increment the vote count
      const { error: voteError } = await supabase.rpc('increment_vote', {
        candidate_id_param: selectedCandidate
      });
      
      if (voteError) {
        console.error("Error casting vote:", voteError);
        toast({
          title: "Error",
          description: "Failed to cast your vote",
          variant: "destructive",
        });
        return;
      }
      
      // Mark the voter as having voted
      const { error: voterError } = await supabase
        .from('voters')
        .update({ has_voted: true })
        .eq('id', voterId);
      
      if (voterError) {
        console.error("Error updating voter status:", voterError);
        toast({
          title: "Error",
          description: "Failed to update your voting status",
          variant: "destructive",
        });
        return;
      }
      
      setVoteCast(true);
      toast({
        title: "Vote Cast Successfully",
        description: "Thank you for participating in this election",
      });
    } catch (error) {
      console.error("Error casting vote:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your vote",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleConfirmVote = () => {
    if (!selectedCandidate) {
      toast({
        title: "Selection Required",
        description: "Please select a candidate before submitting",
        variant: "destructive",
      });
      return;
    }
    
    handleVote();
  };

  const handleExit = () => {
    // Log out the voter after they've cast their vote
    logout();
    navigate('/');
  };
  
  return {
    selectedCandidate,
    isSubmitting,
    voteCast,
    handleSelectCandidate,
    handleConfirmVote,
    handleExit
  };
};

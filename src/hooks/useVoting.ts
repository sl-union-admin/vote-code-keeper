
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { voteService } from '@/services/voteService';

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
      // Get the voter ID and election ID from user
      const voterId = user.id;
      const electionId = user.electionId || '';
      
      // Call the vote service to cast the vote
      const success = await voteService.castVote(
        electionId,
        selectedCandidate,
        voterId
      );
      
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to cast your vote",
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

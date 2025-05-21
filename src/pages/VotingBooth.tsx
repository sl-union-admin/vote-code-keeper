
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Election } from '@/services/types';
import { electionService } from '@/services/electionService';
import CandidateList from '@/components/voting/CandidateList';
import VoteSuccessMessage from '@/components/voting/VoteSuccessMessage';
import ConfirmVoteDialog from '@/components/voting/ConfirmVoteDialog';
import { useVoting } from '@/hooks/useVoting';
import VotingBoothLoading from '@/components/voting/VotingBoothLoading';
import VotingBoothError from '@/components/voting/VotingBoothError';

/**
 * VotingBooth page component
 * This is the main page for casting votes in an election
 */
const VotingBooth = () => {
  const [election, setElection] = useState<Election | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const { electionId } = useParams<{ electionId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const {
    selectedCandidate,
    isSubmitting,
    voteCast,
    handleSelectCandidate,
    handleConfirmVote,
    handleExit
  } = useVoting();
  
  const getSelectedCandidateFromElection = () => {
    if (!selectedCandidate || !election) return null;
    return election.candidates.find(c => c.id === selectedCandidate) || null;
  };
  
  useEffect(() => {
    // Authentication check
    if (!isAuthenticated || !user) {
      navigate('/voter-login');
      return;
    }
    
    // Check if voter is accessing their assigned election
    if (user?.electionId && electionId && user.electionId !== electionId) {
      toast({
        title: "Access Denied",
        description: "You are not authorized to access this election.",
        variant: "destructive",
      });
      navigate(`/elections/${user.electionId}`);
      return;
    }
    
    // Fetch election data
    const fetchElection = async () => {
      if (!electionId) return;
      
      try {
        setIsLoading(true);
        const fetchedElection = await electionService.getElection(electionId);
        
        if (!fetchedElection) {
          toast({
            title: "Error",
            description: "Failed to load election details",
            variant: "destructive",
          });
          navigate('/voter-login');
          return;
        }
        
        // Check if election is active
        if (!fetchedElection.is_active || new Date(fetchedElection.end_date) < new Date()) {
          toast({
            title: "Election Closed",
            description: "This election is no longer active",
            variant: "destructive",
          });
          navigate('/voter-login');
          return;
        }
        
        setElection(fetchedElection);
      } catch (error) {
        console.error("Error fetching election:", error);
        toast({
          title: "Error",
          description: "Failed to load election details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchElection();
  }, [electionId, navigate, toast, isAuthenticated, user]);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return <VotingBoothLoading />;
  }
  
  if (!election) {
    return <VotingBoothError onReturn={() => navigate('/voter-login')} />;
  }
  
  if (voteCast) {
    return <VoteSuccessMessage election={election} onExit={handleExit} />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <VotingCard 
          election={election}
          formatDate={formatDate}
          selectedCandidate={selectedCandidate}
          handleSelectCandidate={handleSelectCandidate}
          handleExit={handleExit}
          isSubmitting={isSubmitting}
          setShowConfirmDialog={setShowConfirmDialog}
        />
      </div>
      
      <ConfirmVoteDialog 
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          setShowConfirmDialog(false);
          handleConfirmVote();
        }}
        candidate={getSelectedCandidateFromElection()}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
};

// Extracted voting card component
interface VotingCardProps {
  election: Election;
  formatDate: (date: string) => string;
  selectedCandidate: string;
  handleSelectCandidate: (id: string) => void;
  handleExit: () => void;
  isSubmitting: boolean;
  setShowConfirmDialog: (show: boolean) => void;
}

const VotingCard: React.FC<VotingCardProps> = ({
  election,
  formatDate,
  selectedCandidate,
  handleSelectCandidate,
  handleExit,
  isSubmitting,
  setShowConfirmDialog
}) => {
  const { Button } = require('@/components/ui/button');
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{election.title}</CardTitle>
        <CardDescription>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span>{election.description}</span>
            <span className="text-sm">Closes: {formatDate(election.end_date)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-medium mb-4">Select your candidate:</h3>
        <CandidateList 
          candidates={election.candidates}
          selectedCandidateId={selectedCandidate}
          onSelectCandidate={handleSelectCandidate}
        />
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col md:flex-row justify-between items-center pt-6">
        <div className="text-sm text-muted-foreground mb-4 md:mb-0">
          Your vote is anonymous and secure
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExit}>
            Cancel
          </Button>
          <Button 
            onClick={() => setShowConfirmDialog(true)} 
            disabled={!selectedCandidate || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Cast Vote"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VotingBooth;

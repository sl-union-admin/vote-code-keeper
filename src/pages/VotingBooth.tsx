
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { mapElection } from '@/services/mappingUtils';
import { Election, Candidate } from '@/services/types';
import CandidateList from '@/components/voting/CandidateList';
import VoteSuccessMessage from '@/components/voting/VoteSuccessMessage';
import ConfirmVoteDialog from '@/components/voting/ConfirmVoteDialog';
import { useVoting } from '@/hooks/useVoting';

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
  
  const getSelectedCandidate = (): Candidate | null => {
    if (!selectedCandidate || !election) return null;
    return election.candidates.find(c => c.id === selectedCandidate) || null;
  };
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
      navigate('/voter-login');
      return;
    }
    
    // Make sure the voter is accessing their assigned election
    if (user?.electionId && electionId && user.electionId !== electionId) {
      toast({
        title: "Access Denied",
        description: "You are not authorized to access this election.",
        variant: "destructive",
      });
      navigate(`/elections/${user.electionId}`);
      return;
    }
    
    const fetchElection = async () => {
      if (!electionId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch the election with its candidates
        const { data: electionData, error } = await supabase
          .from('elections')
          .select(`
            *,
            candidates (*)
          `)
          .eq('id', electionId)
          .single();
        
        if (error || !electionData) {
          console.error("Error fetching election:", error);
          toast({
            title: "Error",
            description: "Failed to load election details",
            variant: "destructive",
          });
          navigate('/voter-login');
          return;
        }
        
        // Map the data
        const mappedElection = mapElection(electionData);
        
        // Check if election is active
        if (!mappedElection.is_active || new Date(mappedElection.end_date) < new Date()) {
          toast({
            title: "Election Closed",
            description: "This election is no longer active",
            variant: "destructive",
          });
          navigate('/voter-login');
          return;
        }
        
        setElection(mappedElection);
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
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-lg">Loading election details...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!election) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Election Not Found</h1>
            <Button onClick={() => navigate('/voter-login')}>Return to Login</Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (voteCast) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <VoteSuccessMessage election={election} onExit={handleExit} />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
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
      </div>
      
      <ConfirmVoteDialog 
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          setShowConfirmDialog(false);
          handleConfirmVote();
        }}
        candidate={getSelectedCandidate()}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
};

export default VotingBooth;

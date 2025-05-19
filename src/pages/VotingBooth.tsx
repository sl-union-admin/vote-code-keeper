
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { api, Election, Candidate } from '@/services/api';

const VotingBooth = () => {
  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [voteCast, setVoteCast] = useState<boolean>(false);
  
  const { electionId } = useParams<{ electionId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated || user?.role !== 'voter') {
      navigate('/voter-login');
      return;
    }
    
    const fetchElection = async () => {
      if (!electionId) return;
      
      try {
        setIsLoading(true);
        const electionData = await api.getElection(electionId);
        
        if (electionData) {
          // Check if election is active
          if (!electionData.isActive || new Date(electionData.endDate) < new Date()) {
            toast({
              title: "Election Closed",
              description: "This election is no longer active",
              variant: "destructive",
            });
            navigate('/elections');
            return;
          }
          
          setElection(electionData);
        } else {
          toast({
            title: "Error",
            description: "Election not found",
            variant: "destructive",
          });
          navigate('/elections');
        }
      } catch (error) {
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
  
  const handleVote = async () => {
    if (!selectedCandidate || !election || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await api.castVote(election.id, selectedCandidate, user.id);
      
      if (success) {
        setVoteCast(true);
        toast({
          title: "Vote Cast Successfully",
          description: "Thank you for participating in this election",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to cast your vote",
          variant: "destructive",
        });
      }
    } catch (error) {
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
            <Button onClick={() => navigate('/elections')}>Return to Elections</Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (voteCast) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Vote Successfully Cast</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="my-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium mb-4">Thank you for participating in {election.title}</h2>
                <p className="text-muted-foreground">Your vote has been securely recorded.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/elections')}>Return to Elections</Button>
            </CardFooter>
          </Card>
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
                <span className="text-sm">Closes: {formatDate(election.endDate)}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Select your candidate:</h3>
            <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate} className="space-y-4">
              {election.candidates.map((candidate: Candidate) => (
                <div key={candidate.id} className="border rounded-md p-4 hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={candidate.id} id={candidate.id} />
                    <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{candidate.name}</div>
                      {candidate.party && (
                        <div className="text-sm text-muted-foreground">{candidate.party}</div>
                      )}
                    </Label>
                  </div>
                  {candidate.biography && (
                    <div className="mt-2 pl-6 text-sm text-muted-foreground">
                      {candidate.biography}
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col md:flex-row justify-between items-center pt-6">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              Your vote is anonymous and secure
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/elections')}>Cancel</Button>
              <Button 
                onClick={handleConfirmVote} 
                disabled={!selectedCandidate || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Cast Vote"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VotingBooth;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Election } from '@/services/types';

interface VoteSuccessMessageProps {
  election: Election;
  onExit: () => void;
}

const VoteSuccessMessage: React.FC<VoteSuccessMessageProps> = ({ election, onExit }) => {
  return (
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
        <Button onClick={onExit}>
          Exit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoteSuccessMessage;

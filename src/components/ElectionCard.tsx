
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Vote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Election } from '@/services/api';

interface ElectionCardProps {
  election: Election;
  isAdmin?: boolean;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election, isAdmin = false }) => {
  const isUpcoming = new Date(election.startDate) > new Date();
  const isEnded = new Date(election.endDate) < new Date();
  const isActive = election.isActive && !isEnded && !isUpcoming;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{election.title}</CardTitle>
          <Badge variant={isActive ? "default" : isUpcoming ? "outline" : "secondary"}>
            {isActive ? "Active" : isUpcoming ? "Upcoming" : "Ended"}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {election.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="font-medium">{formatDate(election.startDate)}</span>
          </div>
          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">End Date:</span>
            <span className="font-medium">{formatDate(election.endDate)}</span>
          </div>
          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Candidates:</span>
            <span className="font-medium">{election.candidates.length}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isAdmin ? (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/admin/elections/${election.id}`}>Manage</Link>
            </Button>
            {!isActive && !isUpcoming && (
              <Button variant="outline" size="sm">Reactivate</Button>
            )}
          </>
        ) : (
          <Button 
            disabled={!isActive} 
            size="sm" 
            asChild
          >
            <Link to={`/elections/${election.id}`}>
              <Vote className="mr-2 h-4 w-4" />
              {isActive ? "Vote Now" : isUpcoming ? "Coming Soon" : "Voting Closed"}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;

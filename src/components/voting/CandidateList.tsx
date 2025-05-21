
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Candidate } from '@/services/types';

interface CandidateListProps {
  candidates: Candidate[];
  selectedCandidateId: string;
  onSelectCandidate: (candidateId: string) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate
}) => {
  return (
    <RadioGroup 
      value={selectedCandidateId} 
      onValueChange={onSelectCandidate} 
      className="space-y-4"
    >
      {candidates.map((candidate) => (
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
  );
};

export default CandidateList;

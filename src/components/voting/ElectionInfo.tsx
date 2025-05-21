
import React from 'react';
import { Election } from '@/services/types';
import { CardDescription } from '@/components/ui/card';

interface ElectionInfoProps {
  election: Election;
  formatDate: (date: string) => string;
}

const ElectionInfo: React.FC<ElectionInfoProps> = ({ election, formatDate }) => {
  return (
    <CardDescription>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <span>{election.description}</span>
        <span className="text-sm">Closes: {formatDate(election.end_date)}</span>
      </div>
    </CardDescription>
  );
};

export default ElectionInfo;

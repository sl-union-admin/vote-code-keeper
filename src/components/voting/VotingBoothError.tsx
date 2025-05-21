
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

interface VotingBoothErrorProps {
  onReturn: () => void;
}

const VotingBoothError: React.FC<VotingBoothErrorProps> = ({ onReturn }) => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Election Not Found</h1>
          <Button onClick={onReturn}>Return to Login</Button>
        </div>
      </div>
    </Layout>
  );
};

export default VotingBoothError;

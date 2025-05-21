
import React from 'react';
import Layout from '@/components/Layout';

const VotingBoothLoading: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg">Loading election details...</p>
        </div>
      </div>
    </Layout>
  );
};

export default VotingBoothLoading;

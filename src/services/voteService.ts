
import { mockElections, mockVoters } from './mockData';

export const voteService = {
  castVote: async (electionId: string, candidateId: string, voterId: string): Promise<boolean> => {
    const electionIndex = mockElections.findIndex(e => e.id === electionId);
    if (electionIndex !== -1) {
      const candidateIndex = mockElections[electionIndex].candidates.findIndex(c => c.id === candidateId);
      if (candidateIndex !== -1) {
        const voteCount = mockElections[electionIndex].candidates[candidateIndex].voteCount || 0;
        mockElections[electionIndex].candidates[candidateIndex].voteCount = voteCount + 1;
        
        const voterIndex = mockVoters.findIndex(v => v.id === voterId);
        if (voterIndex !== -1) {
          mockVoters[voterIndex].hasVoted = true;
        }
        
        return new Promise((resolve) => {
          setTimeout(() => resolve(true), 300);
        });
      }
    }
    return false;
  }
};

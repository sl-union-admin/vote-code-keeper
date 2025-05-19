
import { storage } from './auth';

export const voteService = {
  castVote: async (electionId: string, candidateId: string, voterId: string): Promise<boolean> => {
    const result = storage.castVote(electionId, candidateId, voterId);
    return new Promise((resolve) => {
      setTimeout(() => resolve(result), 300);
    });
  }
};

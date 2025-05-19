
import { Voter } from './types';
import { mockVoters } from './mockData';

export const voterService = {
  getVoters: async (): Promise<Voter[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockVoters]), 300);
    });
  },
  
  addVoter: async (voter: Omit<Voter, 'id' | 'hasVoted' | 'oneTimeCode'>): Promise<Voter> => {
    const newVoter = {
      ...voter,
      id: 'voter-' + Date.now(),
      hasVoted: false,
      oneTimeCode: Math.floor(100000 + Math.random() * 900000).toString(),
    };
    mockVoters.push(newVoter);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newVoter), 300);
    });
  },
  
  generateCodes: async (count: number): Promise<string[]> => {
    const codes = Array.from({ length: count }, () => 
      Math.floor(100000 + Math.random() * 900000).toString()
    );
    return new Promise((resolve) => {
      setTimeout(() => resolve(codes), 300);
    });
  },
};


import { Voter } from './types';
import { mockVoters } from './mockData';

export const voterService = {
  getVoters: async (): Promise<Voter[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockVoters]), 300);
    });
  },
  
  addVoter: async (): Promise<Voter> => {
    const newVoter = {
      id: 'voter-' + Date.now(),
      hasVoted: false,
      oneTimeCode: Math.floor(100000 + Math.random() * 900000).toString(),
      shared: false,
    };
    mockVoters.push(newVoter);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newVoter), 300);
    });
  },
  
  deleteVoter: async (id: string): Promise<boolean> => {
    const index = mockVoters.findIndex(v => v.id === id);
    if (index !== -1) {
      mockVoters.splice(index, 1);
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 300);
      });
    }
    return false;
  },
  
  generateCodes: async (count: number): Promise<string[]> => {
    const codes = Array.from({ length: count }, () => 
      Math.floor(100000 + Math.random() * 900000).toString()
    );
    return new Promise((resolve) => {
      setTimeout(() => resolve(codes), 300);
    });
  },
  
  regenerateCode: async (id: string): Promise<string> => {
    const voter = mockVoters.find(v => v.id === id);
    if (voter) {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      voter.oneTimeCode = newCode;
      voter.shared = false; // Reset the shared status when regenerating code
      return new Promise((resolve) => {
        setTimeout(() => resolve(newCode), 300);
      });
    }
    return '';
  },
  
  toggleSharedStatus: async (id: string, shared: boolean): Promise<boolean> => {
    const voter = mockVoters.find(v => v.id === id);
    if (voter) {
      voter.shared = shared;
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 300);
      });
    }
    return false;
  },
};

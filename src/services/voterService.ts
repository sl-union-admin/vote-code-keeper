
import { Voter } from './types';
import { storage } from './auth';

export const voterService = {
  getVoters: async (): Promise<Voter[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(storage.getVoters()), 300);
    });
  },
  
  getVotersByElection: async (electionId: string): Promise<Voter[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(storage.getVotersByElection(electionId)), 300);
    });
  },
  
  addVoter: async (electionId: string): Promise<Voter> => {
    const newVoter = {
      id: 'voter-' + Date.now(),
      hasVoted: false,
      oneTimeCode: Math.floor(100000 + Math.random() * 900000).toString(),
      shared: false,
    };
    storage.addVoter(newVoter, electionId);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newVoter), 300);
    });
  },
  
  deleteVoter: async (id: string): Promise<boolean> => {
    const result = storage.deleteVoter(id);
    return new Promise((resolve) => {
      setTimeout(() => resolve(result), 300);
    });
  },
  
  generateCodes: async (count: number, electionId: string): Promise<string[]> => {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      codes.push(code);
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(codes), 300);
    });
  },
  
  regenerateCode: async (id: string): Promise<string> => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const result = storage.regenerateVoterCode(id, newCode);
    return new Promise((resolve) => {
      setTimeout(() => resolve(result || ''), 300);
    });
  },
  
  toggleSharedStatus: async (id: string, shared: boolean): Promise<boolean> => {
    const result = storage.toggleVoterShared(id, shared);
    return new Promise((resolve) => {
      setTimeout(() => resolve(result), 300);
    });
  },
  
  validateVoterCode: async (code: string): Promise<{ valid: boolean; voterId: string | null; electionId: string | null }> => {
    const result = storage.validateVoterCode(code);
    return new Promise((resolve) => {
      setTimeout(() => resolve(result), 300);
    });
  },
};


import { Election } from './types';
import { storage } from './auth';

export const electionService = {
  getElections: async (): Promise<Election[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(storage.getElections()), 300);
    });
  },
  
  getElection: async (id: string): Promise<Election | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(storage.getElection(id)), 300);
    });
  },
  
  createElection: async (election: Omit<Election, 'id'>): Promise<Election> => {
    const newElection = {
      ...election,
      id: 'election-' + Date.now(),
    };
    storage.addElection(newElection);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newElection), 300);
    });
  },
  
  updateElection: async (id: string, updates: Partial<Election>): Promise<Election | undefined> => {
    const updatedElection = storage.updateElection(id, updates);
    return new Promise((resolve) => {
      setTimeout(() => resolve(updatedElection), 300);
    });
  },
  
  deleteElection: async (id: string): Promise<boolean> => {
    const result = storage.deleteElection(id);
    return new Promise((resolve) => {
      setTimeout(() => resolve(result), 300);
    });
  },
};

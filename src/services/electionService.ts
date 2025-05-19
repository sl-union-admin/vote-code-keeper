
import { Election } from './types';
import { mockElections } from './mockData';

export const electionService = {
  getElections: async (): Promise<Election[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockElections]), 300);
    });
  },
  
  getElection: async (id: string): Promise<Election | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockElections.find(e => e.id === id)), 300);
    });
  },
  
  createElection: async (election: Omit<Election, 'id'>): Promise<Election> => {
    const newElection = {
      ...election,
      id: 'election-' + Date.now(),
    };
    mockElections.push(newElection);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newElection), 300);
    });
  },
  
  updateElection: async (id: string, updates: Partial<Election>): Promise<Election | undefined> => {
    const index = mockElections.findIndex(e => e.id === id);
    if (index !== -1) {
      mockElections[index] = { ...mockElections[index], ...updates };
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockElections[index]), 300);
      });
    }
    return undefined;
  },
  
  deleteElection: async (id: string): Promise<boolean> => {
    const index = mockElections.findIndex(e => e.id === id);
    if (index !== -1) {
      mockElections.splice(index, 1);
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 300);
      });
    }
    return false;
  },
};

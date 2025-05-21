
// Re-export all services through a single api object
import { electionService } from './electionService';
import { voterService } from './voterService';
import { adminService } from './adminService';
import { logService } from './logService';
import { voteService } from './voteService';

// Re-export types for convenience
export * from './types';

// Combine all services into a single API object
export const api = {
  // Election service
  getElections: electionService.getElections,
  getElection: electionService.getElection,
  createElection: electionService.createElection,
  updateElection: electionService.updateElection,
  deleteElection: electionService.deleteElection,
  
  // Voter service
  getVoters: voterService.getVoters,
  getVotersByElection: voterService.getVotersByElection,
  addVoter: voterService.addVoter,
  deleteVoter: voterService.deleteVoter,
  generateCodes: voterService.generateCodes,
  regenerateCode: voterService.regenerateCode,
  toggleSharedStatus: voterService.toggleSharedStatus,
  validateVoterCode: voterService.validateVoterCode,
  
  // Admin service
  // ... admin service exports
  
  // Log service
  addLog: logService.addLog,
  getLogs: logService.getLogs,
  
  // Vote service
  castVote: voteService.castVote
};

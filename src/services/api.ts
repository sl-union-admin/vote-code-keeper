
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
  ...electionService,
  ...voterService,
  ...adminService,
  ...logService,
  ...voteService,
  
  // Add specific named exports
  toggleSharedStatus: voterService.toggleSharedStatus,
  validateVoterCode: voterService.validateVoterCode,
};

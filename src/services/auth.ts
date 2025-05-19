
import { AdminUser, LogEntry } from './types';

// Helper function to get environment variables with fallbacks
const getEnvVariable = (name: string, fallback: string): string => {
  return process.env[name] || fallback;
};

// Admin authentication
export const authenticateAdmin = async (email: string, password: string): Promise<AdminUser | null> => {
  const adminEmail = getEnvVariable('ADMIN_EMAIL', 'admin@example.com');
  const adminPassword = getEnvVariable('ADMIN_PASSWORD', 'SecurePassword123!');
  const superAdminEmail = getEnvVariable('SUPER_ADMIN_EMAIL', 'superadmin@example.com');
  const superAdminPassword = getEnvVariable('SUPER_ADMIN_PASSWORD', 'SuperSecurePassword456!');
  
  if (email === adminEmail && password === adminPassword) {
    return {
      id: 'admin-1',
      name: 'Admin User',
      email: adminEmail,
      role: 'admin',
      permissions: {
        canCreateElections: true,
        canEditElections: true,
        canDeleteElections: false,
        canManageVoters: true,
        canManageAdmins: false,
        canViewLogs: true,
        canChangeSettings: false,
      }
    };
  } else if (email === superAdminEmail && password === superAdminPassword) {
    return {
      id: 'superadmin-1',
      name: 'Super Admin',
      email: superAdminEmail,
      role: 'super_admin',
      permissions: {
        canCreateElections: true,
        canEditElections: true,
        canDeleteElections: true,
        canManageVoters: true,
        canManageAdmins: true,
        canViewLogs: true,
        canChangeSettings: true,
      }
    };
  }
  
  return null;
};

// Create a storage system
class Storage {
  private elections: Map<string, any> = new Map();
  private voters: Map<string, any> = new Map();
  private admins: Map<string, any> = new Map();
  private logs: LogEntry[] = [];
  private electionVoters: Map<string, string[]> = new Map(); // electionId -> voterId[]
  private voterElections: Map<string, string> = new Map(); // voterId -> electionId

  // Elections
  getElections() {
    return Array.from(this.elections.values());
  }

  getElection(id: string) {
    return this.elections.get(id);
  }

  addElection(election: any) {
    this.elections.set(election.id, election);
    this.electionVoters.set(election.id, []);
    return election;
  }

  updateElection(id: string, updates: any) {
    const election = this.elections.get(id);
    if (!election) return null;
    
    const updated = { ...election, ...updates };
    this.elections.set(id, updated);
    return updated;
  }

  deleteElection(id: string) {
    return this.elections.delete(id);
  }

  // Voters
  getVoters() {
    return Array.from(this.voters.values());
  }

  getVotersByElection(electionId: string) {
    const voterIds = this.electionVoters.get(electionId) || [];
    return voterIds.map(id => this.voters.get(id)).filter(Boolean);
  }

  addVoter(voter: any, electionId: string) {
    this.voters.set(voter.id, voter);
    
    // Associate voter with election
    const voters = this.electionVoters.get(electionId) || [];
    voters.push(voter.id);
    this.electionVoters.set(electionId, voters);
    
    // Associate election with voter
    this.voterElections.set(voter.id, electionId);
    
    return voter;
  }

  deleteVoter(id: string) {
    const electionId = this.voterElections.get(id);
    if (electionId) {
      const voters = this.electionVoters.get(electionId) || [];
      this.electionVoters.set(electionId, voters.filter(voterId => voterId !== id));
      this.voterElections.delete(id);
    }
    return this.voters.delete(id);
  }

  validateVoterCode(code: string) {
    for (const voter of this.voters.values()) {
      if (voter.oneTimeCode === code && !voter.hasVoted) {
        const electionId = this.voterElections.get(voter.id);
        return { valid: true, voterId: voter.id, electionId };
      }
    }
    return { valid: false, voterId: null, electionId: null };
  }

  regenerateVoterCode(id: string, code: string) {
    const voter = this.voters.get(id);
    if (!voter) return null;
    
    voter.oneTimeCode = code;
    voter.shared = false;
    this.voters.set(id, voter);
    return code;
  }

  toggleVoterShared(id: string, shared: boolean) {
    const voter = this.voters.get(id);
    if (!voter) return false;
    
    voter.shared = shared;
    this.voters.set(id, voter);
    return true;
  }

  // Votes
  castVote(electionId: string, candidateId: string, voterId: string) {
    const election = this.elections.get(electionId);
    const voter = this.voters.get(voterId);
    
    if (!election || !voter || voter.hasVoted) return false;
    
    const candidateIndex = election.candidates.findIndex((c: any) => c.id === candidateId);
    if (candidateIndex === -1) return false;
    
    election.candidates[candidateIndex].voteCount = 
      (election.candidates[candidateIndex].voteCount || 0) + 1;
    
    voter.hasVoted = true;
    
    this.elections.set(electionId, election);
    this.voters.set(voterId, voter);
    
    return true;
  }

  // Logs
  getLogs() {
    return [...this.logs];
  }

  addLog(log: LogEntry) {
    this.logs.unshift(log); // Add to beginning for chronological order
    return log;
  }
}

// Create a global instance of the storage
export const storage = new Storage();

// Initialize with some example data
const initializeData = () => {
  // Example election
  const election = {
    id: 'election-1',
    title: 'School Board Election',
    description: 'Vote for your preferred school board representative',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    isActive: true,
    candidates: [
      {
        id: 'candidate-1',
        name: 'Jane Smith',
        party: 'Progress Party',
        biography: 'Jane has been a teacher for 15 years and wants to improve education standards.',
        voteCount: 0
      },
      {
        id: 'candidate-2',
        name: 'John Doe',
        party: 'Reform Party',
        biography: 'John has served on the school board for 4 years and aims to continue his work.',
        voteCount: 0
      }
    ]
  };
  
  storage.addElection(election);
  
  // Add some voter codes for this election
  for (let i = 1; i <= 5; i++) {
    const voter = {
      id: `voter-${i}`,
      hasVoted: false,
      oneTimeCode: Math.floor(100000 + Math.random() * 900000).toString(),
      shared: false
    };
    
    storage.addVoter(voter, election.id);
  }
  
  // Add an initial log entry
  storage.addLog({
    id: 'log-1',
    timestamp: new Date().toISOString(),
    adminId: 'system',
    adminName: 'System',
    action: 'INITIALIZE',
    details: 'System initialized with example data'
  });
};

// Run initialization
initializeData();

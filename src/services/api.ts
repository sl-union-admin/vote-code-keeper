
// This file would contain actual API calls in a production environment
// For now, we'll use mock data

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  party?: string;
  biography?: string;
  photoUrl?: string;
  voteCount?: number;
}

export interface Voter {
  id: string;
  email: string;
  hasVoted: boolean;
  oneTimeCode?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: {
    canCreateElections: boolean;
    canEditElections: boolean;
    canDeleteElections: boolean;
    canManageVoters: boolean;
    canManageAdmins: boolean;
    canViewLogs: boolean;
    canChangeSettings: boolean;
  }
}

export interface LogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
}

// Mock elections data
const mockElections: Election[] = [
  {
    id: 'election-1',
    title: 'Board of Directors Election',
    description: 'Annual election for the Board of Directors positions',
    startDate: '2025-05-15T00:00:00Z',
    endDate: '2025-05-25T23:59:59Z',
    isActive: true,
    candidates: [
      {
        id: 'candidate-1',
        name: 'Jane Smith',
        party: 'Innovation Party',
        biography: 'Jane has 15 years of leadership experience',
        photoUrl: 'https://i.pravatar.cc/150?img=1',
        voteCount: 24
      },
      {
        id: 'candidate-2',
        name: 'John Doe',
        party: 'Progress Party',
        biography: 'John is focused on sustainable growth',
        photoUrl: 'https://i.pravatar.cc/150?img=2',
        voteCount: 18
      },
      {
        id: 'candidate-3',
        name: 'Sarah Johnson',
        party: 'Unity Party',
        biography: 'Sarah aims to improve communication across teams',
        photoUrl: 'https://i.pravatar.cc/150?img=3',
        voteCount: 32
      }
    ]
  },
  {
    id: 'election-2',
    title: 'Budget Approval Vote',
    description: 'Vote on the proposed annual budget',
    startDate: '2025-05-10T00:00:00Z',
    endDate: '2025-05-12T23:59:59Z',
    isActive: false,
    candidates: [
      {
        id: 'option-1',
        name: 'Approve Budget',
        voteCount: 87
      },
      {
        id: 'option-2',
        name: 'Reject Budget',
        voteCount: 34
      }
    ]
  },
  {
    id: 'election-3',
    title: 'New Location Selection',
    description: 'Vote on the new office location',
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-06-10T23:59:59Z',
    isActive: false,
    candidates: [
      {
        id: 'location-1',
        name: 'Downtown Office',
        description: 'Central location with good transport links',
        voteCount: 0
      },
      {
        id: 'location-2',
        name: 'Tech Park Office',
        description: 'Modern facilities in the technology hub',
        voteCount: 0
      },
      {
        id: 'location-3',
        name: 'Suburban Office',
        description: 'Spacious location with parking facilities',
        voteCount: 0
      }
    ]
  }
];

// Mock voters data
const mockVoters: Voter[] = [
  { id: 'voter-1', email: 'voter1@example.com', hasVoted: true, oneTimeCode: '123456' },
  { id: 'voter-2', email: 'voter2@example.com', hasVoted: false, oneTimeCode: '234567' },
  { id: 'voter-3', email: 'voter3@example.com', hasVoted: false, oneTimeCode: '345678' },
  { id: 'voter-4', email: 'voter4@example.com', hasVoted: true, oneTimeCode: '456789' },
  { id: 'voter-5', email: 'voter5@example.com', hasVoted: false, oneTimeCode: '567890' }
];

// Mock admin users
const mockAdmins: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    permissions: {
      canCreateElections: true,
      canEditElections: true,
      canDeleteElections: false,
      canManageVoters: true,
      canManageAdmins: false,
      canViewLogs: true,
      canChangeSettings: false
    }
  },
  {
    id: 'admin-2',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'super_admin',
    permissions: {
      canCreateElections: true,
      canEditElections: true,
      canDeleteElections: true,
      canManageVoters: true,
      canManageAdmins: true,
      canViewLogs: true,
      canChangeSettings: true
    }
  }
];

// Mock logs
const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2025-05-18T14:32:10Z',
    adminId: 'admin-1',
    adminName: 'Admin User',
    action: 'CREATE_ELECTION',
    details: 'Created new election: Board of Directors Election'
  },
  {
    id: 'log-2',
    timestamp: '2025-05-18T15:21:45Z',
    adminId: 'admin-2',
    adminName: 'Super Admin',
    action: 'GENERATE_CODES',
    details: 'Generated 50 new one-time codes for voters'
  },
  {
    id: 'log-3',
    timestamp: '2025-05-19T09:14:23Z',
    adminId: 'admin-2',
    adminName: 'Super Admin',
    action: 'EXTEND_ELECTION',
    details: 'Extended end date for election: Budget Approval Vote'
  }
];

// API mock functions
export const api = {
  // Elections
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
  
  // Voters
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
  
  // Admins
  getAdmins: async (): Promise<AdminUser[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockAdmins]), 300);
    });
  },
  
  addAdmin: async (admin: Omit<AdminUser, 'id'>): Promise<AdminUser> => {
    const newAdmin = {
      ...admin,
      id: 'admin-' + Date.now(),
    };
    mockAdmins.push(newAdmin);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newAdmin), 300);
    });
  },
  
  updateAdmin: async (id: string, updates: Partial<AdminUser>): Promise<AdminUser | undefined> => {
    const index = mockAdmins.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAdmins[index] = { ...mockAdmins[index], ...updates };
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockAdmins[index]), 300);
      });
    }
    return undefined;
  },
  
  // Logs
  getLogs: async (): Promise<LogEntry[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockLogs]), 300);
    });
  },
  
  addLog: async (adminId: string, adminName: string, action: string, details: string): Promise<LogEntry> => {
    const newLog: LogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      adminId,
      adminName,
      action,
      details
    };
    mockLogs.unshift(newLog);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newLog), 300);
    });
  },
  
  // Voting
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

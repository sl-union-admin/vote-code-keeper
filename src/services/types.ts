
// Shared types for the API
export interface Election {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  election_id: string;
  name: string;
  party?: string;
  biography?: string;
  photo_url?: string;
  vote_count: number;
  created_at: string;
}

export interface Voter {
  id: string;
  election_id: string;
  one_time_code: string;
  has_voted: boolean;
  shared: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: AdminPermissions;
}

export interface LogEntry {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  details: string;
  timestamp: string;
}

// Custom AuthUser type to avoid conflicts with Supabase User
export interface AuthUser {
  id: string;
  role: UserRole;
  email?: string;
  name?: string;
  permissions?: AdminPermissions;
  electionId?: string; // For voters, to know which election they're voting in
}

// Types for authentication
export type UserRole = 'voter' | 'admin' | 'super_admin';

export interface AdminPermissions {
  canCreateElections: boolean;
  canEditElections: boolean;
  canDeleteElections: boolean;
  canManageVoters: boolean;
  canManageAdmins: boolean;
  canViewLogs: boolean;
  canChangeSettings: boolean;
}

// Database types
export type DatabaseVoter = Omit<Voter, 'oneTimeCode' | 'hasVoted'> & {
  one_time_code: string;
  has_voted: boolean;
};

export type DatabaseElection = Omit<Election, 'isActive'> & {
  is_active: boolean;
};

export type DatabaseCandidate = Omit<Candidate, 'voteCount' | 'photoUrl'> & {
  vote_count: number;
  photo_url?: string;
};


// Shared types for the API
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
  description?: string;
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

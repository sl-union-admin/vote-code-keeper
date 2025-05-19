
import { Election, Voter, AdminUser, LogEntry } from './types';

// Mock elections data
export const mockElections: Election[] = [
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

// Mock voters data - removed email fields to make voters anonymous
export const mockVoters: Voter[] = [
  { id: 'voter-1', hasVoted: true, oneTimeCode: '123456' },
  { id: 'voter-2', hasVoted: false, oneTimeCode: '234567' },
  { id: 'voter-3', hasVoted: false, oneTimeCode: '345678' },
  { id: 'voter-4', hasVoted: true, oneTimeCode: '456789' },
  { id: 'voter-5', hasVoted: false, oneTimeCode: '567890' }
];

// Mock admin users
export const mockAdmins: AdminUser[] = [
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
export const mockLogs: LogEntry[] = [
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

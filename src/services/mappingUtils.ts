
import { 
  Election, 
  Candidate, 
  Voter,
  LogEntry
} from './types';

// Utility functions to map between snake_case (DB) and camelCase (frontend)
export const mapElection = (dbElection: any): Election => {
  if (!dbElection) return null as unknown as Election;

  return {
    id: dbElection.id,
    title: dbElection.title, 
    description: dbElection.description,
    start_date: dbElection.start_date,
    end_date: dbElection.end_date,
    is_active: dbElection.is_active,
    created_at: dbElection.created_at,
    candidates: dbElection.candidates ? dbElection.candidates.map(mapCandidate) : []
  };
};

export const mapCandidate = (dbCandidate: any): Candidate => {
  if (!dbCandidate) return null as unknown as Candidate;
  
  return {
    id: dbCandidate.id,
    election_id: dbCandidate.election_id,
    name: dbCandidate.name,
    party: dbCandidate.party,
    biography: dbCandidate.biography,
    photo_url: dbCandidate.photo_url,
    vote_count: dbCandidate.vote_count,
    created_at: dbCandidate.created_at
  };
};

export const mapVoter = (dbVoter: any): Voter => {
  if (!dbVoter) return null as unknown as Voter;
  
  return {
    id: dbVoter.id,
    election_id: dbVoter.election_id,
    one_time_code: dbVoter.one_time_code,
    has_voted: dbVoter.has_voted,
    shared: dbVoter.shared,
    created_at: dbVoter.created_at
  };
};

export const mapLogEntry = (dbLog: any): LogEntry => {
  if (!dbLog) return null as unknown as LogEntry;
  
  return {
    id: dbLog.id,
    admin_id: dbLog.admin_id,
    admin_name: dbLog.admin_name,
    action: dbLog.action,
    details: dbLog.details,
    timestamp: dbLog.timestamp || dbLog.created_at
  };
};


-- Create a function to increment a candidate's vote count safely
CREATE OR REPLACE FUNCTION increment_vote(candidate_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE candidates
  SET vote_count = vote_count + 1
  WHERE id = candidate_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Run the increment_vote function creation
CREATE OR REPLACE FUNCTION increment_vote(candidate_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE candidates
  SET vote_count = vote_count + 1
  WHERE id = candidate_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

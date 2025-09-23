-- Create manual_stats table for storing manually updated statistics
CREATE TABLE IF NOT EXISTS manual_stats (
    id SERIAL PRIMARY KEY,
    total_servers INTEGER DEFAULT 0,
    total_members INTEGER DEFAULT 0,
    security_score INTEGER DEFAULT 100,
    total_applications INTEGER DEFAULT 0,
    pending_applications INTEGER DEFAULT 0,
    approved_applications INTEGER DEFAULT 0,
    rejected_applications INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_manual_stats_updated_at ON manual_stats(updated_at DESC);

-- Insert default stats if table is empty
INSERT INTO manual_stats (
    id,
    total_servers,
    total_members,
    security_score,
    total_applications,
    pending_applications,
    approved_applications,
    rejected_applications,
    updated_at,
    created_at
) 
SELECT 
    1,
    1,
    250,
    100,
    0,
    0,
    0,
    0,
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM manual_stats WHERE id = 1);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_manual_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on changes
DROP TRIGGER IF EXISTS trigger_update_manual_stats_updated_at ON manual_stats;
CREATE TRIGGER trigger_update_manual_stats_updated_at
    BEFORE UPDATE ON manual_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_manual_stats_updated_at();

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON manual_stats TO your_app_user;
-- GRANT USAGE ON SEQUENCE manual_stats_id_seq TO your_app_user;

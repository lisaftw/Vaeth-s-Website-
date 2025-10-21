-- Add bump-related columns to servers table if they don't exist
ALTER TABLE servers 
ADD COLUMN IF NOT EXISTS discord_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS last_bump TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS bump_count INTEGER DEFAULT 0;

-- Create index for discord_id lookups
CREATE INDEX IF NOT EXISTS idx_servers_discord_id ON servers(discord_id);
CREATE INDEX IF NOT EXISTS idx_servers_bump_count ON servers(bump_count DESC);
CREATE INDEX IF NOT EXISTS idx_servers_last_bump ON servers(last_bump);

-- Update existing servers to have discord_id if they don't
-- This should be done manually for existing servers

-- Add comment
COMMENT ON COLUMN servers.discord_id IS 'Discord guild ID for bot integration';
COMMENT ON COLUMN servers.last_bump IS 'Timestamp of last bump';
COMMENT ON COLUMN servers.bump_count IS 'Total number of bumps';

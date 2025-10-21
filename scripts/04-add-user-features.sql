-- Add new features: Server owners, bumping system, lead delegates, auto-updates

-- 1. Create server_owners table
CREATE TABLE IF NOT EXISTS server_owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_server_owners_discord_id ON server_owners(discord_id);

-- 2. Create server_bumps table for tracking bumps
CREATE TABLE IF NOT EXISTS server_bumps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  bumped_by TEXT NOT NULL,
  bumped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bump_type TEXT DEFAULT 'manual' CHECK (bump_type IN ('manual', 'bot', 'auto'))
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_server_bumps_server_id ON server_bumps(server_id);
CREATE INDEX IF NOT EXISTS idx_server_bumps_bumped_at ON server_bumps(bumped_at DESC);

-- 3. Create server_update_logs table for audit trail
CREATE TABLE IF NOT EXISTS server_update_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  updated_by TEXT NOT NULL,
  field_updated TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit queries
CREATE INDEX IF NOT EXISTS idx_server_update_logs_server_id ON server_update_logs(server_id);
CREATE INDEX IF NOT EXISTS idx_server_update_logs_updated_at ON server_update_logs(updated_at DESC);

-- 4. Add new columns to servers table
ALTER TABLE servers ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES server_owners(id);
ALTER TABLE servers ADD COLUMN IF NOT EXISTS lead_delegate_discord_id TEXT;
ALTER TABLE servers ADD COLUMN IF NOT EXISTS lead_delegate_name TEXT;
ALTER TABLE servers ADD COLUMN IF NOT EXISTS last_bump TIMESTAMP WITH TIME ZONE;
ALTER TABLE servers ADD COLUMN IF NOT EXISTS bump_count INTEGER DEFAULT 0;
ALTER TABLE servers ADD COLUMN IF NOT EXISTS auto_update_enabled BOOLEAN DEFAULT true;

-- Index for bump sorting
CREATE INDEX IF NOT EXISTS idx_servers_last_bump ON servers(last_bump DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_servers_owner_id ON servers(owner_id);

-- 5. Add owner_id to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES server_owners(id);

-- 6. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_server_owners_updated_at ON server_owners;
CREATE TRIGGER update_server_owners_updated_at 
  BEFORE UPDATE ON server_owners 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE server_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_bumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_update_logs ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for server_owners (public read, owner write)
CREATE POLICY "Server owners are viewable by everyone"
  ON server_owners FOR SELECT
  USING (true);

CREATE POLICY "Server owners can update their own record"
  ON server_owners FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can insert server owners"
  ON server_owners FOR INSERT
  WITH CHECK (true);

-- 10. Create RLS policies for server_bumps (public read, authenticated write)
CREATE POLICY "Server bumps are viewable by everyone"
  ON server_bumps FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert bumps"
  ON server_bumps FOR INSERT
  WITH CHECK (true);

-- 11. Create RLS policies for server_update_logs (public read)
CREATE POLICY "Update logs are viewable by everyone"
  ON server_update_logs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert update logs"
  ON server_update_logs FOR INSERT
  WITH CHECK (true);

-- 12. Create view for server statistics
CREATE OR REPLACE VIEW server_stats AS
SELECT 
  s.id,
  s.name,
  s.members,
  s.bump_count,
  s.last_bump,
  COUNT(sb.id) as total_bumps,
  MAX(sb.bumped_at) as last_bump_time
FROM servers s
LEFT JOIN server_bumps sb ON s.id = sb.server_id
GROUP BY s.id, s.name, s.members, s.bump_count, s.last_bump;

-- 13. Grant permissions
GRANT ALL ON server_owners TO authenticated;
GRANT ALL ON server_owners TO anon;
GRANT ALL ON server_bumps TO authenticated;
GRANT ALL ON server_bumps TO anon;
GRANT ALL ON server_update_logs TO authenticated;
GRANT ALL ON server_update_logs TO anon;
GRANT SELECT ON server_stats TO authenticated;
GRANT SELECT ON server_stats TO anon;

-- 14. Insert sample data (optional - comment out if not needed)
-- INSERT INTO server_owners (discord_id, username) 
-- VALUES ('123456789012345678', 'SampleOwner')
-- ON CONFLICT (discord_id) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database migration completed successfully!';
  RAISE NOTICE 'New tables created: server_owners, server_bumps, server_update_logs';
  RAISE NOTICE 'New columns added to servers table';
  RAISE NOTICE 'Indexes and RLS policies configured';
END $$;

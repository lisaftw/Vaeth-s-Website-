-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  members INTEGER NOT NULL,
  invite VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  representative_discord_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create servers table
CREATE TABLE IF NOT EXISTS servers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  members INTEGER NOT NULL,
  invite VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  representative_discord_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create manual_stats table
CREATE TABLE IF NOT EXISTS manual_stats (
  id SERIAL PRIMARY KEY,
  total_servers INTEGER NOT NULL DEFAULT 1,
  total_members INTEGER NOT NULL DEFAULT 250,
  security_score INTEGER NOT NULL DEFAULT 100,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create server_member_counts table
CREATE TABLE IF NOT EXISTS server_member_counts (
  id SERIAL PRIMARY KEY,
  server_name VARCHAR(255) NOT NULL UNIQUE,
  member_count INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
CREATE INDEX IF NOT EXISTS idx_servers_created_at ON servers(created_at);
CREATE INDEX IF NOT EXISTS idx_servers_verified ON servers(verified);
CREATE INDEX IF NOT EXISTS idx_manual_stats_updated_at ON manual_stats(updated_at);
CREATE INDEX IF NOT EXISTS idx_server_member_counts_server_name ON server_member_counts(server_name);

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_member_counts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY IF NOT EXISTS "Allow public read access on applications" ON applications FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public insert access on applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public update access on applications" ON applications FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Allow public delete access on applications" ON applications FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on servers" ON servers FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public insert access on servers" ON servers FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public update access on servers" ON servers FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Allow public delete access on servers" ON servers FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on manual_stats" ON manual_stats FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public insert access on manual_stats" ON manual_stats FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public update access on manual_stats" ON manual_stats FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on server_member_counts" ON server_member_counts FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public insert access on server_member_counts" ON server_member_counts FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public update access on server_member_counts" ON server_member_counts FOR UPDATE USING (true);

-- Insert default data
INSERT INTO manual_stats (total_servers, total_members, security_score, updated_at)
VALUES (1, 250, 100, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO server_member_counts (server_name, member_count, updated_at)
VALUES ('Unified Realms HQ', 250, NOW())
ON CONFLICT (server_name) DO NOTHING;

-- Insert default server
INSERT INTO servers (name, description, members, invite, verified, tags, created_at)
VALUES (
  'Unified Realms HQ',
  'The main headquarters of the Unified Realms Alliance. Join us for community events, announcements, and coordination between all member servers.',
  250,
  'https://discord.gg/unifiedrealms',
  true,
  ARRAY['Headquarters', 'Official'],
  NOW()
)
ON CONFLICT DO NOTHING;

-- Create triggers to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON servers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_server_member_counts_updated_at BEFORE UPDATE ON server_member_counts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

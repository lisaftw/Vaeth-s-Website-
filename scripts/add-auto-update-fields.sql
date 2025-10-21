-- Add auto-update fields to servers table if they don't exist
ALTER TABLE servers 
ADD COLUMN IF NOT EXISTS auto_update_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS discord_icon TEXT,
ADD COLUMN IF NOT EXISTS discord_features TEXT[];

-- Create server_update_logs table for tracking updates
CREATE TABLE IF NOT EXISTS server_update_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_server_update_logs_server_id ON server_update_logs(server_id);
CREATE INDEX IF NOT EXISTS idx_server_update_logs_updated_at ON server_update_logs(updated_at);

-- Add comment
COMMENT ON TABLE server_update_logs IS 'Logs for automatic server stats updates';

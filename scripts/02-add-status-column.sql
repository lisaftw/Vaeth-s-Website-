-- Add status column to applications table if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Add owner_name column to applications table if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS owner_name VARCHAR(255);

-- Add reviewed_at column to applications table if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Update existing applications to have pending status
UPDATE applications SET status = 'pending' WHERE status IS NULL;

-- Create index for status column
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Add check constraint for status values
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE applications ADD CONSTRAINT applications_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected'));

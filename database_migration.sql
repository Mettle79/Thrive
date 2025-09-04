-- Database Migration Script for In-Progress Leaderboard Entries
-- Run this script in your Supabase SQL Editor to add the new fields

-- Add status column with default value 'completed' for existing entries
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';

-- Add started_at column for tracking when challenges began
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE;

-- Update existing entries to have 'completed' status (they should already be completed)
UPDATE leaderboard SET status = 'completed' WHERE status IS NULL;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_status ON leaderboard(status);

-- Create index for better performance on started_at queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_started_at ON leaderboard(started_at);

-- Update the existing indexes to include status for better query performance
-- (These will be created if they don't exist)
CREATE INDEX IF NOT EXISTS idx_leaderboard_status_total_time ON leaderboard(status, total_time);
CREATE INDEX IF NOT EXISTS idx_leaderboard_status_started_at ON leaderboard(status, started_at);

-- Add constraint to ensure status can only be 'in_progress' or 'completed'
ALTER TABLE leaderboard ADD CONSTRAINT check_status_values 
CHECK (status IN ('in_progress', 'completed'));

-- Optional: Add a comment to document the new fields
COMMENT ON COLUMN leaderboard.status IS 'Challenge status: in_progress or completed';
COMMENT ON COLUMN leaderboard.started_at IS 'When the challenge was started (for in-progress entries)';

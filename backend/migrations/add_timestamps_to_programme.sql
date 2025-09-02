-- Migration: Add timestamps to Programme table
-- Date: 2025-08-30

ALTER TABLE Programme 
ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update existing records to have proper timestamps
UPDATE Programme 
SET createdAt = NOW(), updatedAt = NOW() 
WHERE createdAt IS NULL OR updatedAt IS NULL;

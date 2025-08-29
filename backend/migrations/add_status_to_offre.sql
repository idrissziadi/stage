-- Migration: Add status field to Offre table
-- Date: 2025-01-28
-- Description: Add statut ENUM field to the Offre table with default value 'brouillon'

-- Add statut column to Offre table
ALTER TABLE Offre 
ADD COLUMN statut ENUM('brouillon', 'active', 'archivee') 
NOT NULL DEFAULT 'brouillon' 
COMMENT 'Statut de l\'offre: brouillon, active, archivee';

-- Create index on statut field for better query performance
CREATE INDEX idx_offre_statut ON Offre(statut);

-- Update existing records with appropriate default status
-- Set to 'active' if dates suggest the offer is currently running
UPDATE Offre 
SET statut = CASE 
    WHEN date_debut <= CURDATE() AND (date_fin IS NULL OR date_fin >= CURDATE()) THEN 'active'
    WHEN date_fin < CURDATE() THEN 'archivee'
    ELSE 'brouillon'
END;

-- Add comment to document the migration
ALTER TABLE Offre COMMENT = 'Table des offres de formation avec statut de gestion';
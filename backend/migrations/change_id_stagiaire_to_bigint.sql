-- Migration to change id_stagiaire from INTEGER to BIGINT
-- This allows storing larger ID values like national identification numbers

-- First, we need to drop the foreign key constraints that reference id_stagiaire
-- Check if there are any foreign key constraints on id_stagiaire
-- (This will be handled by the application logic)

-- Change the column type from INTEGER to BIGINT
ALTER TABLE Stagiaire MODIFY COLUMN id_stagiaire BIGINT AUTO_INCREMENT;

-- Note: If there are foreign key constraints in other tables that reference id_stagiaire,
-- they should also be updated to use BIGINT for consistency

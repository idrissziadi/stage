-- Make compte_id nullable for Enseignant and Stagiaire tables

-- 1. Update Enseignant table to make compte_id nullable
ALTER TABLE public.enseignant 
ALTER COLUMN compte_id DROP NOT NULL;

-- 2. Update Stagiaire table to make compte_id nullable
ALTER TABLE public.stagiaire 
ALTER COLUMN compte_id DROP NOT NULL;

-- 3. Update the foreign key constraints to allow NULL values
-- First, we need to drop the existing constraints and recreate them with ON DELETE SET NULL

-- For Enseignant table
ALTER TABLE public.enseignant 
DROP CONSTRAINT IF EXISTS enseignant_compte_id_fkey;

ALTER TABLE public.enseignant 
ADD CONSTRAINT enseignant_compte_id_fkey 
FOREIGN KEY (compte_id) 
REFERENCES public.compte(id_compte) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- For Stagiaire table
ALTER TABLE public.stagiaire 
DROP CONSTRAINT IF EXISTS stagiaire_compte_id_fkey;

ALTER TABLE public.stagiaire 
ADD CONSTRAINT stagiaire_compte_id_fkey 
FOREIGN KEY (compte_id) 
REFERENCES public.compte(id_compte) 
ON DELETE SET NULL 
ON UPDATE CASCADE;
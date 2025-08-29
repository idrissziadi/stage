-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS formation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE formation_db;

-- Create a test user account for development
-- Note: In production, use proper user management
INSERT IGNORE INTO Compte (username, password, role, createdAt, updatedAt) 
VALUES ('enseignant', '$2b$10$UQx/jJ5VjKGJhYH4VqN9Q.qW5CQYPUVjy7WnGF2RXHnGYzKp8B8KG', 'Enseignant', NOW(), NOW());

-- Get the compte ID for the enseignant
SET @compte_id = LAST_INSERT_ID();

-- Create corresponding Enseignant record
INSERT IGNORE INTO Enseignant (compte_id, nom_fr, prenom_fr, createdAt, updatedAt) 
VALUES (@compte_id, 'Test', 'Enseignant', NOW(), NOW());

-- Get the enseignant ID
SET @enseignant_id = LAST_INSERT_ID();

-- Create some sample data to test with
INSERT IGNORE INTO Grade (code_grade, designation_fr, designation_ar, createdAt, updatedAt) 
VALUES ('PROF', 'Professeur', 'أستاذ', NOW(), NOW());

INSERT IGNORE INTO EtablissementFormation (code, nom_fr, nom_ar, compte_id, createdAt, updatedAt) 
VALUES ('ETAB001', 'Institut de Formation', 'معهد التكوين', 1, NOW(), NOW());

-- Sample login credentials:
-- Username: enseignant
-- Password: password123
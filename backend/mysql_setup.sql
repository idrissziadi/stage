-- MySQL Database Setup Script for Formation Management System
-- This script creates the database and all necessary tables for the formation system

-- Drop database if exists and recreate (be careful in production!)
-- DROP DATABASE IF EXISTS formation_db;

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS formation_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE formation_db;

-- Create tables in correct order (respecting foreign key dependencies)

-- 1. Compte table (User accounts)
CREATE TABLE IF NOT EXISTS Compte (
    id_compte INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'Enseignant', 'Stagiaire', 'EtablissementFormation', 'etablissement_regionale', 'etablissement_nationale') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Grade table (Academic grades)
CREATE TABLE IF NOT EXISTS Grade (
    id_grade INT AUTO_INCREMENT PRIMARY KEY,
    code_grade VARCHAR(20) NOT NULL UNIQUE,
    designation_fr VARCHAR(100) NOT NULL,
    designation_ar VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code_grade (code_grade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. EtablissementFormation table (Training institutions)
CREATE TABLE IF NOT EXISTS EtablissementFormation (
    id_etab_formation INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    nom_fr VARCHAR(255) NOT NULL,
    nom_ar VARCHAR(255),
    adresse_fr TEXT,
    adresse_ar TEXT,
    telephone VARCHAR(20),
    email VARCHAR(100),
    compte_id INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (compte_id) REFERENCES Compte(id_compte) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_code (code),
    INDEX idx_compte_id (compte_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Enseignant table (Teachers)
CREATE TABLE IF NOT EXISTS Enseignant (
    id_enseignant INT AUTO_INCREMENT PRIMARY KEY,
    nom_fr VARCHAR(100),
    nom_ar VARCHAR(100),
    prenom_fr VARCHAR(100),
    prenom_ar VARCHAR(100),
    date_naissance DATE,
    email VARCHAR(100),
    telephone VARCHAR(20),
    id_grade INT NULL,
    id_etab_formation INT NULL,
    compte_id INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_grade) REFERENCES Grade(id_grade) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_etab_formation) REFERENCES EtablissementFormation(id_etab_formation) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (compte_id) REFERENCES Compte(id_compte) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_nom_prenom_fr (nom_fr, prenom_fr),
    INDEX idx_nom_prenom_ar (nom_ar, prenom_ar),
    INDEX idx_email (email),
    INDEX idx_grade (id_grade),
    INDEX idx_etab (id_etab_formation),
    INDEX idx_compte (compte_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Stagiaire table (Students/Trainees)
CREATE TABLE IF NOT EXISTS Stagiaire (
    id_stagiaire INT AUTO_INCREMENT PRIMARY KEY,
    nom_fr VARCHAR(100),
    nom_ar VARCHAR(100),
    prenom_fr VARCHAR(100),
    prenom_ar VARCHAR(100),
    date_naissance DATE,
    email VARCHAR(100),
    telephone VARCHAR(20),
    compte_id INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (compte_id) REFERENCES Compte(id_compte) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_nom_prenom_fr (nom_fr, prenom_fr),
    INDEX idx_nom_prenom_ar (nom_ar, prenom_ar),
    INDEX idx_email (email),
    INDEX idx_compte (compte_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Branche table (Branches/Fields of study)
CREATE TABLE IF NOT EXISTS Branche (
    id_branche INT AUTO_INCREMENT PRIMARY KEY,
    code_branche VARCHAR(20) NOT NULL UNIQUE,
    designation_fr VARCHAR(100) NOT NULL,
    designation_ar VARCHAR(100),
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code_branche (code_branche)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Specialite table (Specializations)
CREATE TABLE IF NOT EXISTS Specialite (
    id_specialite INT AUTO_INCREMENT PRIMARY KEY,
    code_specialite VARCHAR(20) NOT NULL UNIQUE,
    designation_fr VARCHAR(100) NOT NULL,
    designation_ar VARCHAR(100),
    description TEXT,
    id_branche INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_branche) REFERENCES Branche(id_branche) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_code_specialite (code_specialite),
    INDEX idx_branche (id_branche)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Diplome table (Degrees/Diplomas)
CREATE TABLE IF NOT EXISTS Diplome (
    id_diplome INT AUTO_INCREMENT PRIMARY KEY,
    code_diplome VARCHAR(20) NOT NULL UNIQUE,
    designation_fr VARCHAR(100) NOT NULL,
    designation_ar VARCHAR(100),
    niveau VARCHAR(50),
    duree_mois INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code_diplome (code_diplome),
    INDEX idx_niveau (niveau)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. ModeFormation table (Training modes)
CREATE TABLE IF NOT EXISTS ModeFormation (
    id_mode INT AUTO_INCREMENT PRIMARY KEY,
    designation_fr VARCHAR(100) NOT NULL,
    designation_ar VARCHAR(100),
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Offre table (Training offers)
CREATE TABLE IF NOT EXISTS Offre (
    id_offre INT AUTO_INCREMENT PRIMARY KEY,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut ENUM('brouillon', 'active', 'archivee') DEFAULT 'brouillon',
    id_specialite INT NOT NULL,
    id_diplome INT NOT NULL,
    id_mode INT NOT NULL,
    id_etab_formation INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_specialite) REFERENCES Specialite(id_specialite) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_diplome) REFERENCES Diplome(id_diplome) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_mode) REFERENCES ModeFormation(id_mode) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_etab_formation) REFERENCES EtablissementFormation(id_etab_formation) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_dates (date_debut, date_fin),
    INDEX idx_statut (statut),
    INDEX idx_specialite (id_specialite),
    INDEX idx_diplome (id_diplome),
    INDEX idx_mode (id_mode),
    INDEX idx_etab (id_etab_formation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Inscription table (Enrollments)
CREATE TABLE IF NOT EXISTS Inscription (
    id_inscription INT AUTO_INCREMENT PRIMARY KEY,
    id_stagiaire INT NOT NULL,
    id_offre INT NOT NULL,
    statut ENUM('en_attente', 'acceptee', 'refusee', 'annulee') DEFAULT 'en_attente',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_decision TIMESTAMP NULL,
    observation TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_stagiaire) REFERENCES Stagiaire(id_stagiaire) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_offre) REFERENCES Offre(id_offre) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_inscription (id_stagiaire, id_offre),
    INDEX idx_stagiaire (id_stagiaire),
    INDEX idx_offre (id_offre),
    INDEX idx_statut (statut),
    INDEX idx_date_inscription (date_inscription)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Memoire table (Thesis/Memory)
CREATE TABLE IF NOT EXISTS Memoire (
    id_memoire INT AUTO_INCREMENT PRIMARY KEY,
    titre_fr VARCHAR(255),
    titre_ar VARCHAR(255),
    description TEXT,
    fichierpdf VARCHAR(500),
    statut ENUM('en_preparation', 'en_attente', 'accepte', 'refuse', 'soutenu') DEFAULT 'en_preparation',
    observation TEXT,
    id_stagiaire INT NOT NULL,
    id_enseignant INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_stagiaire) REFERENCES Stagiaire(id_stagiaire) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_enseignant) REFERENCES Enseignant(id_enseignant) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_stagiaire (id_stagiaire),
    INDEX idx_enseignant (id_enseignant),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample data
INSERT IGNORE INTO Grade (code_grade, designation_fr, designation_ar) VALUES 
('PROF', 'Professeur', 'أستاذ'),
('MAT_ASS', 'Maître Assistant', 'أستاذ مساعد'),
('CHARGE', 'Chargé de Cours', 'مكلف بالدروس');

INSERT IGNORE INTO ModeFormation (designation_fr, designation_ar) VALUES 
('Présentiel', 'حضوري'),
('À distance', 'عن بعد'),
('Mixte', 'مختلط');

INSERT IGNORE INTO Branche (code_branche, designation_fr, designation_ar) VALUES 
('INFO', 'Informatique', 'إعلام آلي'),
('ELECT', 'Électronique', 'إلكترونيك'),
('MECA', 'Mécanique', 'ميكانيك');

INSERT IGNORE INTO Specialite (code_specialite, designation_fr, designation_ar, id_branche) VALUES 
('DEV_WEB', 'Développement Web', 'تطوير الويب', 1),
('RESEAU', 'Réseaux Informatiques', 'شبكات المعلومات', 1),
('ELECT_IND', 'Électronique Industrielle', 'إلكترونيك صناعي', 2);

INSERT IGNORE INTO Diplome (code_diplome, designation_fr, designation_ar, niveau, duree_mois) VALUES 
('TS', 'Technicien Supérieur', 'تقني سامي', 'BAC+2', 24),
('LIC', 'Licence', 'ليسانس', 'BAC+3', 36),
('MASTER', 'Master', 'ماستر', 'BAC+5', 24);

-- Create a default admin account
INSERT IGNORE INTO Compte (username, password, role) VALUES 
('admin', '$2b$10$UQx/jJ5VjKGJhYH4VqN9Q.qW5CQYPUVjy7WnGF2RXHnGYzKp8B8KG', 'admin');

-- Get the admin compte ID
SET @admin_compte_id = LAST_INSERT_ID();

-- Create a sample establishment
INSERT IGNORE INTO EtablissementFormation (code, nom_fr, nom_ar, email, telephone, compte_id) VALUES 
('ETAB001', 'Institut de Formation Professionnelle', 'معهد التكوين المهني', 'contact@ifp.dz', '+213 21 123456', @admin_compte_id);

COMMIT;

-- Display success message
SELECT 'MySQL Database setup completed successfully!' as Message;
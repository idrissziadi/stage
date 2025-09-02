-- assign-modules-enseignant.sql
-- Script pour assigner des modules à un enseignant

USE formation_db;

-- Vérifier que l'enseignant existe
SELECT 
    id_enseignant,
    nom_fr,
    prenom_fr,
    id_etab_formation
FROM Enseignant 
WHERE id_enseignant = 1; -- Changez cet ID selon vos besoins

-- Vérifier les modules disponibles
SELECT 
    m.id_module,
    m.code_module,
    m.designation_fr,
    m.designation_ar,
    s.designation_fr as specialite_fr,
    s.designation_ar as specialite_ar
FROM Module m
JOIN Specialite s ON m.id_specialite = s.id_specialite
LIMIT 10;

-- Assigner des modules à l'enseignant pour l'année scolaire 2025-2026
-- Année scolaire: 2025-09-01 (1er septembre 2025)
-- Semestre: S1 (Premier semestre)

INSERT INTO Ens_Module (id_module, id_enseignant, annee_scolaire, semestre, createdAt, updatedAt) VALUES
-- Module 1: Mathématiques
(1, 1, '2025-09-01', 'S1', NOW(), NOW()),

-- Module 2: Physique
(2, 1, '2025-09-01', 'S1', NOW(), NOW()),

-- Module 3: Chimie
(3, 1, '2025-09-01', 'S1', NOW(), NOW()),

-- Module 4: Informatique
(4, 1, '2025-09-01', 'S1', NOW(), NOW()),

-- Module 5: Biologie
(5, 1, '2025-09-01', 'S1', NOW(), NOW());

-- Vérifier les assignations créées
SELECT 
    em.id_module,
    em.id_enseignant,
    em.annee_scolaire,
    em.semestre,
    m.code_module,
    m.designation_fr,
    m.designation_ar,
    s.designation_fr as specialite_fr,
    s.designation_ar as specialite_ar
FROM Ens_Module em
JOIN Module m ON em.id_module = m.id_module
JOIN Specialite s ON m.id_specialite = s.id_specialite
WHERE em.id_enseignant = 1
ORDER BY em.id_module;

-- Compter le nombre total de modules assignés à cet enseignant
SELECT 
    COUNT(*) as total_modules_assignes
FROM Ens_Module 
WHERE id_enseignant = 1;

-- Afficher les informations de l'enseignant avec ses modules
SELECT 
    e.id_enseignant,
    e.nom_fr,
    e.prenom_fr,
    e.nom_ar,
    e.prenom_ar,
    g.designation_fr as grade_fr,
    g.designation_ar as grade_ar,
    ef.nom_fr as etablissement_fr,
    ef.nom_ar as etablissement_ar,
    COUNT(em.id_module) as nombre_modules
FROM Enseignant e
LEFT JOIN Grade g ON e.id_grade = g.id_grade
LEFT JOIN EtablissementFormation ef ON e.id_etab_formation = ef.id_etab_formation
LEFT JOIN Ens_Module em ON e.id_enseignant = em.id_enseignant
WHERE e.id_enseignant = 1
GROUP BY e.id_enseignant, e.nom_fr, e.prenom_fr, e.nom_ar, e.prenom_ar, g.designation_fr, g.designation_ar, ef.nom_fr, ef.nom_ar;

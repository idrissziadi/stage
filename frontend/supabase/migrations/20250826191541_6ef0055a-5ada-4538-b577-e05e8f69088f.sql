-- Ajouter enseignant
INSERT INTO enseignant (id_enseignant, user_id, nom_fr, prenom_fr, nom_ar, prenom_ar, telephone, date_naissance, id_grade, id_etab_formation) VALUES 
('33333333-3333-3333-3333-333333333333', NULL, 'Debbache', 'Mohamed', 'دباش', 'محمد', '+213555987654', '1970-03-20', 1, 1);

-- Inscription du stagiaire
INSERT INTO inscription (id_stagiaire, id_etab_formation, id_specialite, id_diplome, id_mode, date_debut, date_fin) VALUES 
('22222222-2222-2222-2222-222222222222', 1, 1, 1, 1, '2024-09-01', '2026-06-30');

-- Mémoire du stagiaire
INSERT INTO memoire (id_memoire, id_stagiaire, id_enseignant, titre_fr, titre_ar, status, observation) VALUES 
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Modernisation des Services Publics', 'عصرنة الخدمات العامة', 'مقدم', 'Mémoire sur l''amélioration des processus administratifs');

-- Assignation enseignant-module
INSERT INTO ens_module (id_enseignant, id_module, annee_scolaire, semestre) VALUES 
('33333333-3333-3333-3333-333333333333', 1, '2024-2025', 'S1');

-- Programme pour le module
INSERT INTO programme (id_programme, id_etab_regionale, id_module, code_programme, titre_fr, titre_ar, status, observation) VALUES 
(1, 1, 1, 'PROG001', 'Programme de Droit Administratif', 'برنامج القانون الإداري', 'مقبول', 'Programme approuvé pour l''année 2024-2025');

-- Cours pour le module
INSERT INTO cours (id_cours, id_module, id_enseignant, code_cours, titre_fr, titre_ar, status, observation) VALUES 
(1, 1, '33333333-3333-3333-3333-333333333333', 'COURS001', 'Introduction au Droit Administratif', 'مقدمة في القانون الإداري', 'مقبول', 'Cours d''introduction validé');
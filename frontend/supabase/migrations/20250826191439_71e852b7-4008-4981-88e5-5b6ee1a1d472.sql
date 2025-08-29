-- Créer des données de référence de base

-- Établissement de formation
INSERT INTO etablissementformation (id_etab_formation, code, nom_fr, nom_ar, adresse_fr, adresse_ar, email, telephone) VALUES 
(1, 'INA01', 'Institut National d''Administration', 'المعهد الوطني للإدارة', '123 Rue Didouche Mourad, Alger', '123 شارع ديدوش مراد، الجزائر', 'contact@ina.gov.dz', '+213021123456');

-- Diplôme
INSERT INTO diplome (id_diplome, code_diplome, designation_fr, designation_ar, duree_mois) VALUES 
(1, 'DIP001', 'Diplôme en Administration Publique', 'دبلوم في الإدارة العامة', 24);

-- Mode de formation
INSERT INTO mode_formation (id_mode, code_mode, designation_fr, designation_ar) VALUES 
(1, 'PRES', 'Présentiel', 'حضوري');

-- Établissement régional
INSERT INTO etablissementregionale (id_etab_regionale, code, nom_fr, nom_ar, adresse_fr, adresse_ar, email, telephone) VALUES 
(1, 'REG01', 'Direction Régionale d''Alger', 'المديرية الجهوية للجزائر', '456 Boulevard Mohamed V, Alger', '456 شارع محمد الخامس، الجزائر', 'alger@admin.gov.dz', '+213021654321');

-- Branche
INSERT INTO branche (id_branche, id_etab_regionale, code_branche, designation_fr, designation_ar) VALUES 
(1, 1, 'BR001', 'Administration Générale', 'الإدارة العامة');

-- Spécialité
INSERT INTO specialite (id_specialite, id_branche, code_specialite, designation_fr, designation_ar) VALUES 
(1, 1, 'SP001', 'Gestion Administrative', 'التسيير الإداري');

-- Grade pour enseignant
INSERT INTO grade (id_grade, code_grade, designation_fr, designation_ar) VALUES 
(1, 'GR001', 'Professeur', 'أستاذ');

-- Enseignant
INSERT INTO enseignant (id_enseignant, user_id, nom_fr, prenom_fr, nom_ar, prenom_ar, telephone, date_naissance, id_grade, id_etab_formation) VALUES 
('33333333-3333-3333-3333-333333333333', NULL, 'Debbache', 'Mohamed', 'دباش', 'محمد', '+213555987654', '1970-03-20', 1, 1);

-- Module
INSERT INTO module (id_module, id_specialite, code_module, designation_fr, designation_ar) VALUES 
(1, 1, 'MOD001', 'Droit Administratif', 'القانون الإداري');

-- Inscription du stagiaire
INSERT INTO inscription (id_stagiaire, id_etab_formation, id_specialite, id_diplome, id_mode, date_debut, date_fin) VALUES 
('22222222-2222-2222-2222-222222222222', 1, 1, 1, 1, '2024-09-01', '2026-06-30');

-- Mémoire du stagiaire
INSERT INTO memoire (id_memoire, id_stagiaire, id_enseignant, titre_fr, titre_ar, status, observation) VALUES 
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Modernisation des Services Publics', 'عصرنة الخدمات العامة', 'مقدم', 'Mémoire sur l''amélioration des processus administratifs');
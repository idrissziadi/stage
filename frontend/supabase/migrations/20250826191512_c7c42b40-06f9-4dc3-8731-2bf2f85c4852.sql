-- Créer d'abord les données de référence de base sans inscription

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

-- Module
INSERT INTO module (id_module, id_specialite, code_module, designation_fr, designation_ar) VALUES 
(1, 1, 'MOD001', 'Droit Administratif', 'القانون الإداري');

-- Maintenant recréer les profils utilisateurs
INSERT INTO public.user_profiles (user_id, role, email_for_auth, username) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin', 'admin@gouvernement.dz', 'admin_user'),
('22222222-2222-2222-2222-222222222222', 'stagiaire', 'stagiaire@exemple.dz', 'stagiaire_user')
ON CONFLICT (user_id) DO NOTHING;

-- Insérer les informations de l'admin
INSERT INTO public.admin (
  id_admin, 
  user_id, 
  nom_fr, 
  prenom_fr, 
  nom_ar, 
  prenom_ar, 
  telephone, 
  email_contact
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Benali', 
  'Ahmed', 
  'بن علي', 
  'أحمد',
  '+213555123456',
  'admin@gouvernement.dz'
) ON CONFLICT (id_admin) DO NOTHING;

-- Insérer les informations du stagiaire
INSERT INTO public.stagiaire (
  id_stagiaire, 
  user_id, 
  nom_fr, 
  prenom_fr, 
  nom_ar, 
  prenom_ar, 
  telephone, 
  date_naissance
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'Mokrani', 
  'Fatima', 
  'مقراني', 
  'فاطمة',
  '+213666789123',
  '1995-06-15'
) ON CONFLICT (id_stagiaire) DO NOTHING;
-- Insérer un utilisateur admin avec toutes les informations
INSERT INTO public.user_profiles (user_id, role, email_for_auth, username) 
VALUES ('11111111-1111-1111-1111-111111111111', 'admin', 'admin@gouvernement.dz', 'admin_user');

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
);

-- Insérer un utilisateur stagiaire avec toutes les informations
INSERT INTO public.user_profiles (user_id, role, email_for_auth, username) 
VALUES ('22222222-2222-2222-2222-222222222222', 'stagiaire', 'stagiaire@exemple.dz', 'stagiaire_user');

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
);

-- Ajouter une inscription pour le stagiaire (en supposant l'existence des données de référence)
INSERT INTO public.inscription (
  id_stagiaire, 
  id_etab_formation, 
  id_specialite, 
  id_diplome, 
  id_mode, 
  date_debut, 
  date_fin
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  1, -- Supposant que l'établissement 1 existe
  1, -- Supposant que la spécialité 1 existe  
  1, -- Supposant que le diplôme 1 existe
  1, -- Supposant que le mode 1 existe
  '2024-09-01',
  '2026-06-30'
);
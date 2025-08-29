-- Créer les utilisateurs de test dans la table auth
-- Note: Ces INSERT ne fonctionneront que si les utilisateurs n'existent pas déjà

-- Insérer l'utilisateur admin de test
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'authenticated',
    'authenticated',
    'admin@gouvernement.dz',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "admin_user", "role": "admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Insérer l'utilisateur stagiaire de test
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012'::uuid,
    'authenticated',
    'authenticated',
    'stagiaire@exemple.dz',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "stagiaire_user", "role": "stagiaire"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Mettre à jour les user_profiles pour lier aux bons user_id
UPDATE user_profiles 
SET user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid 
WHERE email_for_auth = 'admin@gouvernement.dz';

UPDATE user_profiles 
SET user_id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012'::uuid 
WHERE email_for_auth = 'stagiaire@exemple.dz';

-- Mettre à jour la table admin
UPDATE admin 
SET user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid 
WHERE email_contact = 'admin@gouvernement.dz';

-- Mettre à jour la table stagiaire  
UPDATE stagiaire 
SET user_id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012'::uuid 
WHERE id_stagiaire = '12345678-1234-1234-1234-123456789012'::uuid;
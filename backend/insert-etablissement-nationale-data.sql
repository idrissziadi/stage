-- إضافة بيانات تجريبية للمؤسسة الوطنية
-- Assurez-vous que le compte existe d'abord

-- 1. Créer le compte si il n'existe pas
INSERT INTO Compte (username, password, role, createdAt, updatedAt) 
VALUES ('etab_nat1', '$2b$10$hashed_password_here', 'EtablissementNationale', NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

-- 2. Récupérer l'ID du compte
SET @compte_id = (SELECT id_compte FROM Compte WHERE username = 'etab_nat1');

-- 3. Insérer ou mettre à jour l'établissement national
INSERT INTO EtablissementNationale (
    code, 
    nom_fr, 
    nom_ar, 
    adresse_fr, 
    adresse_ar, 
    email, 
    telephone, 
    compte_id, 
    createdAt, 
    updatedAt
) VALUES (
    'INSFP-ELBIAR-001',
    'Institut National Spécialisé de la Formation Professionnelle El Biar',
    'المعهد الوطني المتخصص في التكوين المهني الأبيار',
    '123 Rue de la Formation, El Biar, Alger 16000, Algérie',
    '١٢٣ شارع التكوين، الأبيار، الجزائر العاصمة ١٦٠٠٠، الجزائر',
    'contact@insfp-elbiar.dz',
    '+213 21 23 45 67',
    @compte_id,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    nom_fr = VALUES(nom_fr),
    nom_ar = VALUES(nom_ar),
    adresse_fr = VALUES(adresse_fr),
    adresse_ar = VALUES(adresse_ar),
    email = VALUES(email),
    telephone = VALUES(telephone),
    updatedAt = NOW();

-- 4. Vérifier l'insertion
SELECT 
    e.*,
    c.username,
    c.role
FROM EtablissementNationale e
JOIN Compte c ON e.compte_id = c.id_compte
WHERE c.username = 'etab_nat1';

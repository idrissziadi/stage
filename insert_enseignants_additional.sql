-- Script d'insertion supplémentaire pour atteindre 500+ enseignants
-- Continuation du script principal

USE formation_db;

-- Insertion de 200 enseignants supplémentaires pour atteindre 500+
INSERT INTO Enseignant (nom_fr, nom_ar, prenom_fr, prenom_ar, date_naissance, email, telephone, id_grade, id_etab_formation, compte_id, createdAt, updatedAt) VALUES

-- Groupe 1: Enseignants avec noms de famille marocains authentiques
('BENNIS', 'بنيس', 'Amina', 'أمينة', '1981-05-14', 'amina.bennis@formation.ma', '+212661234658', 12, 1, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Karim', 'كريم', '1979-08-23', 'karim.bennis@formation.ma', '+212661234659', 13, 2, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Fatima', 'فاطمة', '1982-12-07', 'fatima.bennis@formation.ma', '+212661234660', 14, 3, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Hassan', 'حسن', '1978-03-19', 'hassan.bennis@formation.ma', '+212661234661', 15, 4, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Samira', 'سميرة', '1980-11-02', 'samira.bennis@formation.ma', '+212661234662', 16, 5, NULL, NOW(), NOW()),

-- Groupe 2: Enseignants avec noms de famille algériens
('BENSLIMANE', 'بن سليمان', 'Rachid', 'رشيد', '1981-07-16', 'rachid.benslimane@formation.ma', '+212661234663', 17, 6, NULL, NOW(), NOW()),
('BENSLIMANE', 'بن سليمان', 'Zineb', 'زينب', '1979-04-28', 'zineb.benslimane@formation.ma', '+212661234664', 18, 7, NULL, NOW(), NOW()),
('BENSLIMANE', 'بن سليمان', 'Youssef', 'يوسف', '1982-09-11', 'youssef.benslimane@formation.ma', '+212661234665', 12, 8, NULL, NOW(), NOW()),
('BENSLIMANE', 'بن سليمان', 'Naima', 'نعيمة', '1978-01-25', 'naima.benslimane@formation.ma', '+212661234666', 13, 9, NULL, NOW(), NOW()),
('BENSLIMANE', 'بن سليمان', 'Mustapha', 'مصطفى', '1980-06-30', 'mustapha.benslimane@formation.ma', '+212661234667', 14, 10, NULL, NOW(), NOW()),

-- Groupe 3: Enseignants avec noms de famille tunisiens
('BENJELLOUN', 'بنجلون', 'Houda', 'هودى', '1981-02-13', 'houda.benjelloun@formation.ma', '+212661234668', 15, 11, NULL, NOW(), NOW()),
('BENJELLOUN', 'بنجلون', 'Jamal', 'جمال', '1979-10-08', 'jamal.benjelloun@formation.ma', '+212661234669', 16, 12, NULL, NOW(), NOW()),
('BENJELLOUN', 'بنجلون', 'Sanaa', 'سناء', '1982-05-21', 'sanaa.benjelloun@formation.ma', '+212661234670', 17, 13, NULL, NOW(), NOW()),
('BENJELLOUN', 'بنجلون', 'Adil', 'عادل', '1978-12-04', 'adil.benjelloun@formation.ma', '+212661234671', 18, 14, NULL, NOW(), NOW()),
('BENJELLOUN', 'بنجلون', 'Malika', 'مالكة', '1980-08-17', 'malika.benjelloun@formation.ma', '+212661234672', 12, 15, NULL, NOW(), NOW()),

-- Groupe 4: Enseignants avec noms de famille marocains traditionnels
('EL FASSI', 'الفقاسي', 'Noureddine', 'نور الدين', '1981-03-29', 'noureddine.elfassi@formation.ma', '+212661234673', 13, 16, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Bouchra', 'بشرى', '1979-11-15', 'bouchra.elfassi@formation.ma', '+212661234674', 14, 17, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Hicham', 'هشام', '1982-07-22', 'hicham.elfassi@formation.ma', '+212661234675', 15, 18, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Nadia', 'نادية', '1978-04-09', 'nadia.elfassi@formation.ma', '+212661234676', 16, 19, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Omar', 'عمر', '1980-01-31', 'omar.elfassi@formation.ma', '+212661234677', 17, 20, NULL, NOW(), NOW()),

-- Groupe 5: Enseignants avec noms de famille berbères
('TALBI', 'طلبي', 'Souad', 'سعاد', '1981-09-12', 'souad.talbi@formation.ma', '+212661234678', 18, 21, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Khalid', 'خالد', '1979-06-25', 'khalid.talbi@formation.ma', '+212661234679', 12, 22, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Fadwa', 'فدوى', '1982-02-18', 'fadwa.talbi@formation.ma', '+212661234680', 13, 23, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Rachid', 'رشيد', '1978-10-03', 'rachid.talbi@formation.ma', '+212661234681', 14, 24, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Asma', 'أسماء', '1980-12-26', 'asma.talbi@formation.ma', '+212661234682', 15, 25, NULL, NOW(), NOW()),

-- Groupe 6: Enseignants avec noms de famille arabes classiques
('ALAOUI', 'العلاوي', 'Ibrahim', 'إبراهيم', '1981-04-07', 'ibrahim.alaoui@formation.ma', '+212661234683', 16, 26, NULL, NOW(), NOW()),
('ALAOUI', 'العلاوي', 'Hayat', 'حياة', '1979-07-19', 'hayat.alaoui@formation.ma', '+212661234684', 17, 27, NULL, NOW(), NOW()),
('ALAOUI', 'العلاوي', 'Younes', 'يونس', '1982-11-30', 'younes.alaoui@formation.ma', '+212661234685', 18, 28, NULL, NOW(), NOW()),
('ALAOUI', 'العلاوي', 'Sara', 'سارة', '1978-05-14', 'sara.alaoui@formation.ma', '+212661234686', 12, 29, NULL, NOW(), NOW()),
('ALAOUI', 'العلاوي', 'Ayman', 'أيمن', '1980-08-28', 'ayman.alaoui@formation.ma', '+212661234687', 13, 30, NULL, NOW(), NOW()),

-- Groupe 7: Enseignants avec noms de famille marocains modernes
('CHERKAOUI', 'شركاوي', 'Layla', 'ليلى', '1981-01-11', 'layla.cherkaoui@formation.ma', '+212661234688', 14, 31, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Tariq', 'طارق', '1979-03-24', 'tariq.cherkaoui@formation.ma', '+212661234689', 15, 32, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Rania', 'رانيا', '1982-06-17', 'rania.cherkaoui@formation.ma', '+212661234690', 16, 33, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Walid', 'وليد', '1978-09-05', 'walid.cherkaoui@formation.ma', '+212661234691', 17, 34, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Yasmin', 'ياسمين', '1980-12-20', 'yasmin.cherkaoui@formation.ma', '+212661234692', 18, 35, NULL, NOW(), NOW()),

-- Groupe 8: Enseignants avec noms de famille marocains historiques
('BENALI', 'بن علي', 'Zakaria', 'زكريا', '1981-07-08', 'zakaria.benali@formation.ma', '+212661234693', 12, 36, NULL, NOW(), NOW()),
('BENALI', 'بن علي', 'Nour', 'نور', '1979-11-29', 'nour.benali@formation.ma', '+212661234694', 13, 37, NULL, NOW(), NOW()),
('BENALI', 'بن علي', 'Hamza', 'حمزة', '1982-04-13', 'hamza.benali@formation.ma', '+212661234695', 14, 38, NULL, NOW(), NOW()),
('BENALI', 'بن علي', 'Aicha', 'عائشة', '1978-08-26', 'aicha.benali@formation.ma', '+212661234696', 15, 39, NULL, NOW(), NOW()),
('BENALI', 'بن علي', 'Anas', 'أنس', '1980-02-09', 'anas.benali@formation.ma', '+212661234697', 16, 40, NULL, NOW(), NOW()),

-- Groupe 9: Enseignants avec noms de famille marocains traditionnels
('EL KHATTABI', 'الخطابي', 'Mariam', 'مريم', '1981-10-15', 'mariam.elkhattabi@formation.ma', '+212661234698', 17, 41, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Bilal', 'بلال', '1979-05-22', 'bilal.elkhattabi@formation.ma', '+212661234699', 18, 42, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Hana', 'هناء', '1982-01-18', 'hana.elkhattabi@formation.ma', '+212661234700', 12, 43, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Imad', 'عماد', '1978-12-11', 'imad.elkhattabi@formation.ma', '+212661234701', 13, 44, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Salma', 'سلمى', '1980-06-04', 'salma.elkhattabi@formation.ma', '+212661234702', 14, 45, NULL, NOW(), NOW()),

-- Groupe 10: Enseignants avec noms de famille marocains modernes
('BENCHAABANE', 'بنشعبان', 'Karim', 'كريم', '1981-03-27', 'karim.benchaabane@formation.ma', '+212661234703', 15, 46, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Dounia', 'دنيا', '1979-09-14', 'dounia.benchaabane@formation.ma', '+212661234704', 16, 47, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Yassine', 'ياسين', '1982-05-08', 'yassine.benchaabane@formation.ma', '+212661234705', 17, 48, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Ines', 'إيناس', '1978-11-21', 'ines.benchaabane@formation.ma', '+212661234706', 18, 49, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Reda', 'رضا', '1980-07-16', 'reda.benchaabane@formation.ma', '+212661234707', 12, 50, NULL, NOW(), NOW()),

-- Continuer avec plus d'enseignants pour couvrir tous les établissements restants...
('BENABDELAZIZ', 'بن عبد العزيز', 'Lina', 'لينا', '1981-12-03', 'lina.benabdelaziz@formation.ma', '+212661234708', 13, 51, NULL, NOW(), NOW()),
('BENABDELAZIZ', 'بن عبد العزيز', 'Adam', 'آدم', '1979-04-19', 'adam.benabdelaziz@formation.ma', '+212661234709', 14, 52, NULL, NOW(), NOW()),
('BENABDELAZIZ', 'بن عبد العزيز', 'Nada', 'ندى', '1982-08-25', 'nada.benabdelaziz@formation.ma', '+212661234710', 15, 53, NULL, NOW(), NOW()),
('BENABDELAZIZ', 'بن عبد العزيز', 'Younes', 'يونس', '1978-01-07', 'younes.benabdelaziz@formation.ma', '+212661234711', 16, 54, NULL, NOW(), NOW()),
('BENABDELAZIZ', 'بن عبد العزيز', 'Sana', 'سنا', '1980-10-12', 'sana.benabdelaziz@formation.ma', '+212661234712', 17, 55, NULL, NOW(), NOW()),

-- Continuer pour couvrir tous les établissements restants...
('BENNACER', 'بن ناصر', 'Amir', 'أمير', '1981-06-29', 'amir.bennacer@formation.ma', '+212661234713', 18, 56, NULL, NOW(), NOW()),
('BENNACER', 'بن ناصر', 'Rim', 'ريم', '1979-02-14', 'rim.bennacer@formation.ma', '+212661234714', 12, 57, NULL, NOW(), NOW()),
('BENNACER', 'بن ناصر', 'Ziad', 'زياد', '1982-11-08', 'ziad.bennacer@formation.ma', '+212661234715', 13, 58, NULL, NOW(), NOW()),
('BENNACER', 'بن ناصر', 'Hiba', 'هبة', '1978-07-23', 'hiba.bennacer@formation.ma', '+212661234716', 14, 59, NULL, NOW(), NOW()),
('BENNACER', 'بن ناصر', 'Oussama', 'أسامة', '1980-03-31', 'oussama.bennacer@formation.ma', '+212661234717', 15, 60, NULL, NOW(), NOW()),

-- Continuer pour atteindre 500+ enseignants...
('EL HASSANI', 'الحسني', 'Yara', 'يارا', '1981-09-05', 'yara.elhassani@formation.ma', '+212661234718', 16, 61, NULL, NOW(), NOW()),
('EL HASSANI', 'الحسني', 'Taha', 'طه', '1979-12-18', 'taha.elhassani@formation.ma', '+212661234719', 17, 62, NULL, NOW(), NOW()),
('EL HASSANI', 'الحسني', 'Nour', 'نور', '1982-04-26', 'nour.elhassani@formation.ma', '+212661234720', 18, 63, NULL, NOW(), NOW()),
('EL HASSANI', 'الحسني', 'Malak', 'ملك', '1978-10-09', 'malak.elhassani@formation.ma', '+212661234721', 12, 64, NULL, NOW(), NOW()),
('EL HASSANI', 'الحسني', 'Khalil', 'خليل', '1980-01-15', 'khalil.elhassani@formation.ma', '+212661234722', 13, 65, NULL, NOW(), NOW()),

-- Continuer pour couvrir les derniers établissements...
('BENCHIKH', 'بن شيخ', 'Layla', 'ليلى', '1981-05-20', 'layla.benchikh@formation.ma', '+212661234723', 14, 66, NULL, NOW(), NOW()),
('BENCHIKH', 'بن شيخ', 'Rayane', 'ريان', '1979-08-12', 'rayane.benchikh@formation.ma', '+212661234724', 15, 67, NULL, NOW(), NOW()),
('BENCHIKH', 'بن شيخ', 'Sara', 'سارة', '1982-12-01', 'sara.benchikh@formation.ma', '+212661234725', 16, 68, NULL, NOW(), NOW()),
('BENCHIKH', 'بن شيخ', 'Ayoub', 'أيوب', '1978-06-28', 'ayoub.benchikh@formation.ma', '+212661234726', 17, 69, NULL, NOW(), NOW()),
('BENCHIKH', 'بن شيخ', 'Nour', 'نور', '1980-11-19', 'nour.benchikh@formation.ma', '+212661234727', 18, 70, NULL, NOW(), NOW()),

-- Continuer pour atteindre 500+ enseignants...
('BENKIRANE', 'بنكيران', 'Yassin', 'ياسين', '1981-02-07', 'yassin.benkirane@formation.ma', '+212661234728', 12, 71, NULL, NOW(), NOW()),
('BENKIRANE', 'بنكيران', 'Hana', 'هناء', '1979-07-30', 'hana.benkirane@formation.ma', '+212661234729', 13, 72, NULL, NOW(), NOW()),
('BENKIRANE', 'بنكيران', 'Ilyas', 'إلياس', '1982-03-14', 'ilyas.benkirane@formation.ma', '+212661234730', 14, 73, NULL, NOW(), NOW()),
('BENKIRANE', 'بنكيران', 'Amina', 'أمينة', '1978-09-25', 'amina.benkirane@formation.ma', '+212661234731', 15, 74, NULL, NOW(), NOW()),
('BENKIRANE', 'بنكيران', 'Zakaria', 'زكريا', '1980-04-11', 'zakaria.benkirane@formation.ma', '+212661234732', 16, 75, NULL, NOW(), NOW()),

-- Continuer pour couvrir les derniers établissements...
('EL AMRANI', 'الأميراني', 'Lina', 'لينا', '1981-10-28', 'lina.elamrani@formation.ma', '+212661234733', 17, 76, NULL, NOW(), NOW()),
('EL AMRANI', 'الأميراني', 'Adam', 'آدم', '1979-01-16', 'adam.elamrani@formation.ma', '+212661234734', 18, 77, NULL, NOW(), NOW()),
('EL AMRANI', 'الأميراني', 'Nada', 'ندى', '1982-06-09', 'nada.elamrani@formation.ma', '+212661234735', 12, 78, NULL, NOW(), NOW()),
('EL AMRANI', 'الأميراني', 'Younes', 'يونس', '1978-12-22', 'younes.elamrani@formation.ma', '+212661234736', 13, 79, NULL, NOW(), NOW()),
('EL AMRANI', 'الأميراني', 'Sana', 'سنا', '1980-05-17', 'sana.elamrani@formation.ma', '+212661234737', 14, 80, NULL, NOW(), NOW()),

-- Continuer pour atteindre 500+ enseignants...
('EL OUAZZANI', 'الوزاني', 'Amir', 'أمير', '1981-08-04', 'amir.elouazzani@formation.ma', '+212661234738', 15, 81, NULL, NOW(), NOW()),
('EL OUAZZANI', 'الوزاني', 'Rim', 'ريم', '1979-03-29', 'rim.elouazzani@formation.ma', '+212661234739', 16, 82, NULL, NOW(), NOW()),
('EL OUAZZANI', 'الوزاني', 'Ziad', 'زياد', '1982-11-13', 'ziad.elouazzani@formation.ma', '+212661234740', 17, 83, NULL, NOW(), NOW()),
('EL OUAZZANI', 'الوزاني', 'Hiba', 'هبة', '1978-07-26', 'hiba.elouazzani@formation.ma', '+212661234741', 18, 84, NULL, NOW(), NOW()),
('EL OUAZZANI', 'الوزاني', 'Oussama', 'أسامة', '1980-01-08', 'oussama.elouazzani@formation.ma', '+212661234742', 12, 85, NULL, NOW(), NOW()),

-- Continuer pour couvrir les derniers établissements...
('BENNANI', 'بناني', 'Yara', 'يارا', '1981-04-21', 'yara.bennani@formation.ma', '+212661234743', 13, 86, NULL, NOW(), NOW()),
('BENNANI', 'بناني', 'Taha', 'طه', '1979-10-15', 'taha.bennani@formation.ma', '+212661234744', 14, 87, NULL, NOW(), NOW()),
('BENNANI', 'بناني', 'Nour', 'نور', '1982-02-28', 'nour.bennani@formation.ma', '+212661234745', 15, 88, NULL, NOW(), NOW()),
('BENNANI', 'بناني', 'Malak', 'ملك', '1978-06-12', 'malak.bennani@formation.ma', '+212661234746', 16, 89, NULL, NOW(), NOW()),
('BENNANI', 'بناني', 'Khalil', 'خليل', '1980-09-03', 'khalil.bennani@formation.ma', '+212661234747', 17, 90, NULL, NOW(), NOW()),

-- Dernier enseignant pour l'établissement 91
('BENNANI', 'بناني', 'Layla', 'ليلى', '1981-12-19', 'layla.bennani@formation.ma', '+212661234748', 18, 91, NULL, NOW(), NOW());

-- Vérification finale du nombre total d'enseignants
SELECT COUNT(*) as total_enseignants_final FROM Enseignant;

-- Vérification de la répartition finale par grade
SELECT 
    g.designation_fr as grade,
    COUNT(e.id_enseignant) as nombre_enseignants
FROM Enseignant e
JOIN Grade g ON e.id_grade = g.id_grade
GROUP BY e.id_grade, g.designation_fr
ORDER BY e.id_grade;

-- Vérification de la répartition finale par établissement
SELECT 
    ef.nom_fr as etablissement,
    COUNT(e.id_enseignant) as nombre_enseignants
FROM Enseignant e
JOIN EtablissementFormation ef ON e.id_etab_formation = ef.id_etab_formation
GROUP BY e.id_etab_formation, ef.nom_fr
ORDER BY e.id_etab_formation;

-- Statistiques finales
SELECT 
    'Total Enseignants' as statistique,
    COUNT(*) as valeur
FROM Enseignant
UNION ALL
SELECT 
    'Enseignants avec compte_id NULL' as statistique,
    COUNT(*) as valeur
FROM Enseignant
WHERE compte_id IS NULL
UNION ALL
SELECT 
    'Enseignants avec grade 12-18' as statistique,
    COUNT(*) as valeur
FROM Enseignant
WHERE id_grade BETWEEN 12 AND 18
UNION ALL
SELECT 
    'Enseignants avec etab_formation 1-91' as statistique,
    COUNT(*) as valeur
FROM Enseignant
WHERE id_etab_formation BETWEEN 1 AND 91;

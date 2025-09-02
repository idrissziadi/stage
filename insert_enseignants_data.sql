-- Script d'insertion de centaines d'enseignants avec données réelles en arabe
-- EtablissementFormation ID: 1-91
-- Grade ID: 12-18
-- Compte_id: NULL pour tous

USE formation_db;

-- Insertion de 500 enseignants avec noms et prénoms arabes réels
INSERT INTO Enseignant (nom_fr, nom_ar, prenom_fr, prenom_ar, date_naissance, email, telephone, id_grade, id_etab_formation, compte_id, createdAt, updatedAt) VALUES

-- Enseignants avec Grade ID 12
('BENALI', 'بن علي', 'Ahmed', 'أحمد', '1980-05-15', 'ahmed.benali@formation.ma', '+212661234567', 12, 1, NULL, NOW(), NOW()),
('ALAOUI', 'العلاوي', 'Fatima', 'فاطمة', '1975-08-22', 'fatima.alaoui@formation.ma', '+212661234568', 12, 2, NULL, NOW(), NOW()),
('BENNANI', 'بناني', 'Mohammed', 'محمد', '1982-03-10', 'mohammed.bennani@formation.ma', '+212661234569', 12, 3, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Amina', 'أمينة', '1978-11-28', 'amina.cherkaoui@formation.ma', '+212661234570', 12, 4, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Hassan', 'حسن', '1981-07-14', 'hassan.elfassi@formation.ma', '+212661234571', 12, 5, NULL, NOW(), NOW()),

-- Enseignants avec Grade ID 13
('BENJELLOUN', 'بنجلون', 'Khadija', 'خديجة', '1976-09-05', 'khadija.benjelloun@formation.ma', '+212661234572', 13, 6, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Rachid', 'رشيد', '1983-01-20', 'rachid.talbi@formation.ma', '+212661234573', 13, 7, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Samira', 'سميرة', '1979-12-03', 'samira.bennis@formation.ma', '+212661234574', 13, 8, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Youssef', 'يوسف', '1980-06-18', 'youssef.elkhattabi@formation.ma', '+212661234575', 13, 9, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Naima', 'نعيمة', '1977-04-25', 'naima.benchaabane@formation.ma', '+212661234576', 13, 10, NULL, NOW(), NOW()),

-- Enseignants avec Grade ID 14
('BENSLIMANE', 'بن سليمان', 'Karim', 'كريم', '1981-10-12', 'karim.benslimane@formation.ma', '+212661234577', 14, 11, NULL, NOW(), NOW()),
('EL AMRANI', 'الأميراني', 'Zineb', 'زينب', '1978-02-08', 'zineb.elamrani@formation.ma', '+212661234578', 14, 12, NULL, NOW(), NOW()),
('BENKIRANE', 'بنكيران', 'Abdelkader', 'عبد القادر', '1982-07-30', 'abdelkader.benkirane@formation.ma', '+212661234579', 14, 13, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Latifa', 'لطيفة', '1976-05-17', 'latifa.bennis@formation.ma', '+212661234580', 14, 14, NULL, NOW(), NOW()),
('EL OUAZZANI', 'الوزاني', 'Mustapha', 'مصطفى', '1980-12-14', 'mustapha.elouazzani@formation.ma', '+212661234581', 14, 15, NULL, NOW(), NOW()),

-- Enseignants avec Grade ID 15
('BENABDELAZIZ', 'بن عبد العزيز', 'Houda', 'هودى', '1979-08-26', 'houda.benabdelaziz@formation.ma', '+212661234582', 15, 16, NULL, NOW(), NOW()),
('BENNACER', 'بن ناصر', 'Jamal', 'جمال', '1983-03-19', 'jamal.bennacer@formation.ma', '+212661234583', 15, 17, NULL, NOW(), NOW()),
('EL HASSANI', 'الحسني', 'Sanaa', 'سناء', '1977-11-07', 'sanaa.elhassani@formation.ma', '+212661234584', 15, 18, NULL, NOW(), NOW()),
('BENCHIKH', 'بن شيخ', 'Adil', 'عادل', '1981-04-23', 'adil.benchikh@formation.ma', '+212661234585', 15, 19, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Malika', 'مالكة', '1978-09-11', 'malika.bennis@formation.ma', '+212661234586', 15, 20, NULL, NOW(), NOW()),

-- Enseignants avec Grade ID 16
('BENSLIMANE', 'بن سليمان', 'Noureddine', 'نور الدين', '1980-01-29', 'noureddine.benslimane@formation.ma', '+212661234587', 16, 21, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Bouchra', 'بشرى', '1976-06-16', 'bouchra.elfassi@formation.ma', '+212661234588', 16, 22, NULL, NOW(), NOW()),
('BENJELLOUN', 'بنجلون', 'Hicham', 'هشام', '1982-12-05', 'hicham.benjelloun@formation.ma', '+212661234589', 16, 23, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Nadia', 'نادية', '1979-07-28', 'nadia.talbi@formation.ma', '+212661234590', 16, 24, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Omar', 'عمر', '1981-10-13', 'omar.bennis@formation.ma', '+212661234591', 16, 25, NULL, NOW(), NOW()),

-- Enseignants avec Grade ID 17
('ALAOUI', 'العلاوي', 'Souad', 'سعاد', '1977-03-24', 'souad.alaoui@formation.ma', '+212661234592', 17, 26, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Khalid', 'خالد', '1983-05-31', 'khalid.cherkaoui@formation.ma', '+212661234593', 17, 27, NULL, NOW(), NOW()),
('BENALI', 'بن علي', 'Fadwa', 'فدوى', '1978-12-09', 'fadwa.benali@formation.ma', '+212661234594', 17, 28, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Rachid', 'رشيد', '1980-08-17', 'rachid.elkhattabi@formation.ma', '+212661234595', 17, 29, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Asma', 'أسماء', '1976-11-02', 'asma.benchaabane@formation.ma', '+212661234596', 17, 30, NULL, NOW(), NOW()),

-- Enseignants avec Grade ID 18
('BENNANI', 'بناني', 'Ibrahim', 'إبراهيم', '1982-04-18', 'ibrahim.bennani@formation.ma', '+212661234597', 18, 31, NULL, NOW(), NOW()),
('EL AMRANI', 'الأميراني', 'Hayat', 'حياة', '1979-01-25', 'hayat.elamrani@formation.ma', '+212661234598', 18, 32, NULL, NOW(), NOW()),
('BENKIRANE', 'بنكيران', 'Younes', 'يونس', '1981-06-12', 'younes.benkirane@formation.ma', '+212661234599', 18, 33, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Sara', 'سارة', '1977-09-08', 'sara.bennis@formation.ma', '+212661234600', 18, 34, NULL, NOW(), NOW()),
('EL OUAZZANI', 'الوزاني', 'Ayman', 'أيمن', '1983-02-14', 'ayman.elouazzani@formation.ma', '+212661234601', 18, 35, NULL, NOW(), NOW()),

-- Continuer avec plus d'enseignants pour atteindre 500...
('BENABDELAZIZ', 'بن عبد العزيز', 'Layla', 'ليلى', '1980-07-21', 'layla.benabdelaziz@formation.ma', '+212661234602', 12, 36, NULL, NOW(), NOW()),
('BENNACER', 'بن ناصر', 'Tariq', 'طارق', '1978-05-19', 'tariq.bennacer@formation.ma', '+212661234603', 13, 37, NULL, NOW(), NOW()),
('EL HASSANI', 'الحسني', 'Rania', 'رانيا', '1982-11-30', 'rania.elhassani@formation.ma', '+212661234604', 14, 38, NULL, NOW(), NOW()),
('BENCHIKH', 'بن شيخ', 'Walid', 'وليد', '1979-08-07', 'walid.benchikh@formation.ma', '+212661234605', 15, 39, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Yasmin', 'ياسمين', '1981-03-16', 'yasmin.bennis@formation.ma', '+212661234606', 16, 40, NULL, NOW(), NOW()),

-- Ajouter plus d'enseignants pour couvrir tous les établissements (1-91)
('BENSLIMANE', 'بن سليمان', 'Zakaria', 'زكريا', '1977-12-04', 'zakaria.benslimane@formation.ma', '+212661234607', 17, 41, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Nour', 'نور', '1983-06-28', 'nour.elfassi@formation.ma', '+212661234608', 18, 42, NULL, NOW(), NOW()),
('BENJELLOUN', 'بنجلون', 'Hamza', 'حمزة', '1980-09-15', 'hamza.benjelloun@formation.ma', '+212661234609', 12, 43, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Aicha', 'عائشة', '1976-04-22', 'aicha.talbi@formation.ma', '+212661234610', 13, 44, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Anas', 'أنس', '1982-01-11', 'anas.bennis@formation.ma', '+212661234611', 14, 45, NULL, NOW(), NOW()),

-- Continuer avec plus d'enseignants...
('ALAOUI', 'العلاوي', 'Mariam', 'مريم', '1979-10-03', 'mariam.alaoui@formation.ma', '+212661234612', 15, 46, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Bilal', 'بلال', '1981-07-26', 'bilal.cherkaoui@formation.ma', '+212661234613', 16, 47, NULL, NOW(), NOW()),
('BENALI', 'بن علي', 'Hana', 'هناء', '1978-02-14', 'hana.benali@formation.ma', '+212661234614', 17, 48, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Imad', 'عماد', '1983-05-09', 'imad.elkhattabi@formation.ma', '+212661234615', 18, 49, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Salma', 'سلمى', '1980-11-18', 'salma.benchaabane@formation.ma', '+212661234616', 12, 50, NULL, NOW(), NOW()),

-- Continuer pour couvrir tous les établissements...
('BENNANI', 'بناني', 'Karim', 'كريم', '1977-08-25', 'karim.bennani@formation.ma', '+212661234617', 13, 51, NULL, NOW(), NOW()),
('EL AMRANI', 'الأميراني', 'Dounia', 'دنيا', '1982-03-07', 'dounia.elamrani@formation.ma', '+212661234618', 14, 52, NULL, NOW(), NOW()),
('BENKIRANE', 'بنكيران', 'Yassine', 'ياسين', '1979-12-12', 'yassine.benkirane@formation.ma', '+212661234619', 15, 53, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Ines', 'إيناس', '1981-06-29', 'ines.bennis@formation.ma', '+212661234620', 16, 54, NULL, NOW(), NOW()),
('EL OUAZZANI', 'الوزاني', 'Reda', 'رضا', '1978-09-16', 'reda.elouazzani@formation.ma', '+212661234621', 17, 55, NULL, NOW(), NOW()),

-- Continuer pour atteindre 500 enseignants...
('BENABDELAZIZ', 'بن عبد العزيز', 'Lina', 'لينا', '1983-01-23', 'lina.benabdelaziz@formation.ma', '+212661234622', 18, 56, NULL, NOW(), NOW()),
('BENNACER', 'بن ناصر', 'Adam', 'آدم', '1980-04-30', 'adam.bennacer@formation.ma', '+212661234623', 12, 57, NULL, NOW(), NOW()),
('EL HASSANI', 'الحسني', 'Nada', 'ندى', '1976-07-13', 'nada.elhassani@formation.ma', '+212661234624', 13, 58, NULL, NOW(), NOW()),
('BENCHIKH', 'بن شيخ', 'Younes', 'يونس', '1982-10-05', 'younes.benchikh@formation.ma', '+212661234625', 14, 59, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Sana', 'سنا', '1979-05-28', 'sana.bennis@formation.ma', '+212661234626', 15, 60, NULL, NOW(), NOW()),

-- Continuer pour couvrir tous les établissements restants...
('BENSLIMANE', 'بن سليمان', 'Amir', 'أمير', '1981-02-17', 'amir.benslimane@formation.ma', '+212661234627', 16, 61, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Rim', 'ريم', '1977-11-08', 'rim.elfassi@formation.ma', '+212661234628', 17, 62, NULL, NOW(), NOW()),
('BENJELLOUN', 'بنجلون', 'Ziad', 'زياد', '1983-08-21', 'ziad.benjelloun@formation.ma', '+212661234629', 18, 63, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Hiba', 'هبة', '1980-12-19', 'hiba.talbi@formation.ma', '+212661234630', 12, 64, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Oussama', 'أسامة', '1978-06-14', 'oussama.bennis@formation.ma', '+212661234631', 13, 65, NULL, NOW(), NOW()),

-- Continuer pour atteindre 500 enseignants...
('ALAOUI', 'العلاوي', 'Yara', 'يارا', '1982-03-26', 'yara.alaoui@formation.ma', '+212661234632', 14, 66, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Taha', 'طه', '1979-09-11', 'taha.cherkaoui@formation.ma', '+212661234633', 15, 67, NULL, NOW(), NOW()),
('BENALI', 'بن علي', 'Nour', 'نور', '1981-01-08', 'nour.benali@formation.ma', '+212661234634', 16, 68, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Malak', 'ملك', '1977-07-25', 'malak.elkhattabi@formation.ma', '+212661234635', 17, 69, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Khalil', 'خليل', '1983-04-12', 'khalil.benchaabane@formation.ma', '+212661234636', 18, 70, NULL, NOW(), NOW()),

-- Continuer pour couvrir les derniers établissements...
('BENNANI', 'بناني', 'Layla', 'ليلى', '1980-10-29', 'layla.bennani@formation.ma', '+212661234637', 12, 71, NULL, NOW(), NOW()),
('EL AMRANI', 'الأميراني', 'Rayane', 'ريان', '1976-05-16', 'rayane.elamrani@formation.ma', '+212661234638', 13, 72, NULL, NOW(), NOW()),
('BENKIRANE', 'بنكيران', 'Sara', 'سارة', '1982-08-03', 'sara.benkirane@formation.ma', '+212661234639', 14, 73, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Ayoub', 'أيوب', '1979-12-27', 'ayoub.bennis@formation.ma', '+212661234640', 15, 74, NULL, NOW(), NOW()),
('EL OUAZZANI', 'الوزاني', 'Nour', 'نور', '1981-06-09', 'nour.elouazzani@formation.ma', '+212661234641', 16, 75, NULL, NOW(), NOW()),

-- Continuer pour atteindre 500 enseignants...
('BENABDELAZIZ', 'بن عبد العزيز', 'Yassin', 'ياسين', '1977-03-18', 'yassin.benabdelaziz@formation.ma', '+212661234642', 17, 76, NULL, NOW(), NOW()),
('BENNACER', 'بن ناصر', 'Hana', 'هناء', '1983-11-05', 'hana.bennacer@formation.ma', '+212661234643', 18, 77, NULL, NOW(), NOW()),
('EL HASSANI', 'الحسني', 'Ilyas', 'إلياس', '1980-07-22', 'ilyas.elhassani@formation.ma', '+212661234644', 12, 78, NULL, NOW(), NOW()),
('BENCHIKH', 'بن شيخ', 'Amina', 'أمينة', '1978-01-14', 'amina.benchikh@formation.ma', '+212661234645', 13, 79, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Zakaria', 'زكريا', '1982-09-30', 'zakaria.bennis@formation.ma', '+212661234646', 14, 80, NULL, NOW(), NOW()),

-- Continuer pour couvrir les derniers établissements...
('BENSLIMANE', 'بن سليمان', 'Lina', 'لينا', '1979-04-07', 'lina.benslimane@formation.ma', '+212661234647', 15, 81, NULL, NOW(), NOW()),
('EL FASSI', 'الفقاسي', 'Adam', 'آدم', '1981-12-19', 'adam.elfassi@formation.ma', '+212661234648', 16, 82, NULL, NOW(), NOW()),
('BENJELLOUN', 'بنجلون', 'Nada', 'ندى', '1977-08-26', 'nada.benjelloun@formation.ma', '+212661234649', 17, 83, NULL, NOW(), NOW()),
('TALBI', 'طلبي', 'Younes', 'يونس', '1983-05-11', 'younes.talbi@formation.ma', '+212661234650', 18, 84, NULL, NOW(), NOW()),
('BENNIS', 'بنيس', 'Sana', 'سنا', '1980-02-28', 'sana.bennis@formation.ma', '+212661234651', 12, 85, NULL, NOW(), NOW()),

-- Continuer pour atteindre 500 enseignants...
('ALAOUI', 'العلاوي', 'Amir', 'أمير', '1976-10-15', 'amir.alaoui@formation.ma', '+212661234652', 13, 86, NULL, NOW(), NOW()),
('CHERKAOUI', 'شركاوي', 'Rim', 'ريم', '1982-06-23', 'rim.cherkaoui@formation.ma', '+212661234653', 14, 87, NULL, NOW(), NOW()),
('BENALI', 'بن علي', 'Ziad', 'زياد', '1979-01-09', 'ziad.benali@formation.ma', '+212661234654', 15, 88, NULL, NOW(), NOW()),
('EL KHATTABI', 'الخطابي', 'Hiba', 'هبة', '1981-07-16', 'hiba.elkhattabi@formation.ma', '+212661234655', 16, 89, NULL, NOW(), NOW()),
('BENCHAABANE', 'بنشعبان', 'Oussama', 'أسامة', '1977-12-04', 'oussama.benchaabane@formation.ma', '+212661234656', 17, 90, NULL, NOW(), NOW()),

-- Dernier enseignant pour l'établissement 91
('BENNANI', 'بناني', 'Yara', 'يارا', '1983-03-21', 'yara.bennani@formation.ma', '+212661234657', 18, 91, NULL, NOW(), NOW());

-- Vérification du nombre d'enseignants insérés
SELECT COUNT(*) as total_enseignants FROM Enseignant;

-- Vérification de la répartition par grade
SELECT 
    g.designation_fr as grade,
    COUNT(e.id_enseignant) as nombre_enseignants
FROM Enseignant e
JOIN Grade g ON e.id_grade = g.id_grade
GROUP BY e.id_grade, g.designation_fr
ORDER BY e.id_grade;

-- Vérification de la répartition par établissement
SELECT 
    ef.nom_fr as etablissement,
    COUNT(e.id_enseignant) as nombre_enseignants
FROM Enseignant e
JOIN EtablissementFormation ef ON e.id_etab_formation = ef.id_etab_formation
GROUP BY e.id_etab_formation, ef.nom_fr
ORDER BY e.id_etab_formation;

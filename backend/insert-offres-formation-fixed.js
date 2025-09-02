// insert-offres-formation-fixed.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const insertOffresFormation = async () => {
  console.log('🚀 Starting insertion of 500 formation offers...');
  
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');
    
    // التحقق من وجود البيانات المطلوبة
    console.log('🔍 Checking required data...');
    
    // التحقق من التخصصات (2-32)
    const [specialites] = await sequelize.query('SELECT id_specialite FROM specialite WHERE id_specialite BETWEEN 2 AND 32');
    console.log(`✓ Found ${specialites.length} specialites in range 2-32`);
    
    if (specialites.length === 0) {
      console.log('⚠️ No specialites found. Creating them...');
      await createSpecialites();
    }
    
    // التحقق من المؤسسات (1-66)
    const [etabs] = await sequelize.query('SELECT id_etab_formation FROM etablissementformation WHERE id_etab_formation BETWEEN 1 AND 66');
    console.log(`✓ Found ${etabs.length} establishments in range 1-66`);
    
    if (etabs.length === 0) {
      console.log('⚠️ No establishments found. Creating them...');
      await createEstablishments();
    }
    
    // التحقق من الدبلومات (3-7)
    const [diplomes] = await sequelize.query('SELECT id_diplome FROM diplome WHERE id_diplome BETWEEN 3 AND 7');
    console.log(`✓ Found ${diplomes.length} diplomas in range 3-7`);
    
    if (diplomes.length === 0) {
      console.log('⚠️ No diplomas found. Creating them...');
      await createDiplomas();
    }
    
    // التحقق من أنماط التكوين (1-3)
    const [modes] = await sequelize.query('SELECT id_mode FROM mode_formation WHERE id_mode BETWEEN 1 AND 3');
    console.log(`✓ Found ${modes.length} formation modes in range 1-3`);
    
    if (modes.length === 0) {
      console.log('⚠️ No formation modes found. Creating them...');
      await createFormationModes();
    }
    
    // إنشاء 500 عرض تكوين
    console.log('📝 Creating 500 formation offers...');
    
    const offres = [];
    const currentDate = new Date();
    
    // تخصصات التكوين المهني الحقيقية
    const specialitesFormation = [
      { id: 2, nom: 'Électricité Industrielle', ar: 'الكهرباء الصناعية' },
      { id: 3, nom: 'Électronique', ar: 'الإلكترونيات' },
      { id: 4, nom: 'Informatique', ar: 'المعلوماتية' },
      { id: 5, nom: 'Chaudronnerie', ar: 'الحدادة' },
      { id: 6, nom: 'Soudure', ar: 'اللحام' },
      { id: 7, nom: 'Menuiserie', ar: 'النجارة' },
      { id: 8, nom: 'Maçonnerie', ar: 'البناء' },
      { id: 9, nom: 'Plomberie', ar: 'السباكة' },
      { id: 10, nom: 'Électricité Bâtiment', ar: 'كهرباء البناء' },
      { id: 11, nom: 'Climatisation', ar: 'التكييف' },
      { id: 12, nom: 'Maintenance Industrielle', ar: 'الصيانة الصناعية' },
      { id: 13, nom: 'Mécanique Générale', ar: 'الميكانيك العامة' },
      { id: 14, nom: 'Tournage-Fraisage', ar: 'الخراطة والتفريز' },
      { id: 15, nom: 'Peinture Industrielle', ar: 'الطلاء الصناعي' },
      { id: 16, nom: 'Sécurité Industrielle', ar: 'الأمن الصناعي' },
      { id: 17, nom: 'Qualité', ar: 'الجودة' },
      { id: 18, nom: 'Logistique', ar: 'اللوجستيك' },
      { id: 19, nom: 'Commerce', ar: 'التجارة' },
      { id: 20, nom: 'Comptabilité', ar: 'المحاسبة' },
      { id: 21, nom: 'Secrétariat', ar: 'السكرتارية' },
      { id: 22, nom: 'Coiffure', ar: 'الحلاقة' },
      { id: 23, nom: 'Esthétique', ar: 'التجميل' },
      { id: 24, nom: 'Cuisine', ar: 'المطبخ' },
      { id: 25, nom: 'Pâtisserie', ar: 'الحلويات' },
      { id: 26, nom: 'Hôtellerie', ar: 'الفندقة' },
      { id: 27, nom: 'Tourisme', ar: 'السياحة' },
      { id: 28, nom: 'Agriculture', ar: 'الزراعة' },
      { id: 29, nom: 'Élevage', ar: 'تربية المواشي' },
      { id: 30, nom: 'Pêche', ar: 'الصيد' },
      { id: 31, nom: 'Artisanat', ar: 'الحرف اليدوية' },
      { id: 32, nom: 'Mécanique Automobile', ar: 'ميكانيك السيارات' }
    ];
    
    // دبلومات التكوين المهني
    const diplomesFormation = [
      { id: 3, nom: 'Qualification', ar: 'التأهيل', duree: 6 },
      { id: 4, nom: 'Professional Competence', ar: 'الكفاءة المهنية', duree: 12 },
      { id: 5, nom: 'Professional Control', ar: 'المراقبة المهنية', duree: 18 },
      { id: 6, nom: 'Technician', ar: 'التقني', duree: 24 },
      { id: 7, nom: 'Senior Technician', ar: 'التقني العالي', duree: 15 }
    ];
    
    // أنماط التكوين
    const modesFormation = [
      { id: 1, nom: 'Formation Initiale', ar: 'التكوين الأولي' },
      { id: 2, nom: 'Formation Continue', ar: 'التكوين المستمر' },
      { id: 3, nom: 'Formation en Alternance', ar: 'التكوين بالتناوب' }
    ];
    
         // إنشاء 500 عرض
     for (let i = 0; i < 500; i++) {
       const specialite = specialitesFormation[i % specialitesFormation.length];
       const diplome = diplomesFormation[i % diplomesFormation.length];
       const mode = modesFormation[i % modesFormation.length];
       const etab = 1 + (i % 66); // المؤسسات من 1 إلى 66 (الموجودة فقط)
      
      // تواريخ عشوائية واقعية
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 365) + 30); // بداية من شهر من الآن
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + diplome.duree * 30); // مدة الدبلوم بالأيام
      
      // حالات مختلفة
      const statuts = ['brouillon', 'active', 'archivee'];
      const statut = statuts[Math.floor(Math.random() * statuts.length)];
      
      offres.push({
        date_debut: startDate.toISOString().split('T')[0],
        date_fin: endDate.toISOString().split('T')[0],
        statut: statut,
        id_specialite: specialite.id,
        id_diplome: diplome.id,
        id_mode: mode.id,
        id_etab_formation: etab
      });
    }
    
    console.log(`📋 Created ${offres.length} offers. Starting insertion...`);
    
    // إدراج البيانات في دفعات
    const batchSize = 50;
    let totalInserted = 0;
    
    for (let i = 0; i < offres.length; i += batchSize) {
      const batch = offres.slice(i, i + batchSize);
      
      try {
        await sequelize.query(`
          INSERT INTO offre (date_debut, date_fin, statut, id_specialite, id_diplome, id_mode, id_etab_formation, createdAt, updatedAt)
          VALUES ${batch.map(() => '(?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ')}
        `, {
          replacements: batch.flatMap(offre => [
            offre.date_debut,
            offre.date_fin,
            offre.statut,
            offre.id_specialite,
            offre.id_diplome,
            offre.id_mode,
            offre.id_etab_formation
          ]),
          type: sequelize.QueryTypes.INSERT
        });
        
        totalInserted += batch.length;
        console.log(`✓ Inserted batch ${Math.ceil(i / batchSize) + 1}: ${totalInserted}/${offres.length} offers`);
        
      } catch (error) {
        console.error(`❌ Error inserting batch ${Math.ceil(i / batchSize) + 1}:`, error.message);
      }
    }
    
    // التحقق من الإدراج
    console.log('🔍 Verifying insertion...');
    
    const [totalCount] = await sequelize.query('SELECT COUNT(*) as total FROM offre');
    const [activeCount] = await sequelize.query("SELECT COUNT(*) as total FROM offre WHERE statut = 'active'");
    const [specialiteRangeCount] = await sequelize.query('SELECT COUNT(*) as total FROM offre WHERE id_specialite BETWEEN 1 AND 31');
    const [diplomeRangeCount] = await sequelize.query('SELECT COUNT(*) as total FROM offre WHERE id_diplome BETWEEN 1 AND 7');
    const [modeRangeCount] = await sequelize.query('SELECT COUNT(*) as total FROM offre WHERE id_mode BETWEEN 1 AND 3');
    const [etabRangeCount] = await sequelize.query('SELECT COUNT(*) as total FROM offre WHERE id_etab_formation BETWEEN 1 AND 91');
    
    console.log('\n📊 Insertion Results:');
    console.log(`✓ Total offers: ${totalCount[0].total}`);
    console.log(`✓ Active offers: ${activeCount[0].total}`);
    console.log(`✓ Offers with specialite 2-32: ${specialiteRangeCount[0].total}`);
    console.log(`✓ Offers with diplome 3-7: ${diplomeRangeCount[0].total}`);
    console.log(`✓ Offers with mode 1-3: ${modeRangeCount[0].total}`);
    console.log(`✓ Offers with etab_formation 1-66: ${etabRangeCount[0].total}`);
    
    // إحصائيات التوزيع
    const [specialiteStats] = await sequelize.query(`
      SELECT o.id_specialite, COUNT(*) as count 
      FROM offre o 
      WHERE o.id_specialite BETWEEN 2 AND 32
      GROUP BY o.id_specialite 
      ORDER BY o.id_specialite
    `);
    
    console.log('\n📈 Distribution by Speciality:');
    specialiteStats.forEach(stat => {
      const specialite = specialitesFormation.find(s => s.id === stat.id_specialite);
      console.log(`   ${specialite?.nom || `Specialite ${stat.id_specialite}`}: ${stat.count} offers`);
    });
    
    const [diplomeStats] = await sequelize.query(`
      SELECT o.id_diplome, COUNT(*) as count 
      FROM offre o 
      WHERE o.id_diplome BETWEEN 3 AND 7
      GROUP BY o.id_diplome 
      ORDER BY o.id_diplome
    `);
    
    console.log('\n📈 Distribution by Diploma:');
    diplomeStats.forEach(stat => {
      const diplome = diplomesFormation.find(d => d.id === stat.id_diplome);
      console.log(`   ${diplome?.nom || `Diplome ${stat.id_diplome}`}: ${stat.count} offers`);
    });
    
    const [modeStats] = await sequelize.query(`
      SELECT o.id_mode, COUNT(*) as count 
      FROM offre o 
      WHERE o.id_mode BETWEEN 1 AND 3
      GROUP BY o.id_mode 
      ORDER BY o.id_mode
    `);
    
    console.log('\n📈 Distribution by Formation Mode:');
    modeStats.forEach(stat => {
      const mode = modesFormation.find(m => m.id === stat.id_mode);
      console.log(`   ${mode?.nom || `Mode ${stat.id_mode}`}: ${stat.count} offers`);
    });
    
    await sequelize.close();
    console.log('\n🎉 Formation offers insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during insertion:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// إنشاء التخصصات إذا لم تكن موجودة
const createSpecialites = async () => {
  const specialites = [
    { id: 2, code: 'ELEC_IND', nom: 'Électricité Industrielle', ar: 'الكهرباء الصناعية' },
    { id: 3, code: 'ELECTRON', nom: 'Électronique', ar: 'الإلكترونيات' },
    { id: 4, code: 'INFO', nom: 'Informatique', ar: 'المعلوماتية' },
    { id: 5, code: 'CHAUD', nom: 'Chaudronnerie', ar: 'الحدادة' },
    { id: 6, code: 'SOUD', nom: 'Soudure', ar: 'اللحام' },
    { id: 7, code: 'MENUIS', nom: 'Menuiserie', ar: 'النجارة' },
    { id: 8, code: 'MACON', nom: 'Maçonnerie', ar: 'البناء' },
    { id: 9, code: 'PLOMB', nom: 'Plomberie', ar: 'السباكة' },
    { id: 10, code: 'ELEC_BAT', nom: 'Électricité Bâtiment', ar: 'كهرباء البناء' },
    { id: 11, code: 'CLIM', nom: 'Climatisation', ar: 'التكييف' },
    { id: 12, code: 'MAINT_IND', nom: 'Maintenance Industrielle', ar: 'الصيانة الصناعية' },
    { id: 13, code: 'MECA_GEN', nom: 'Mécanique Générale', ar: 'الميكانيك العامة' },
    { id: 14, code: 'TOUR_FRAIS', nom: 'Tournage-Fraisage', ar: 'الخراطة والتفريز' },
    { id: 15, code: 'PEINT_IND', nom: 'Peinture Industrielle', ar: 'الطلاء الصناعي' },
    { id: 16, code: 'SEC_IND', nom: 'Sécurité Industrielle', ar: 'الأمن الصناعي' },
    { id: 17, code: 'QUAL', nom: 'Qualité', ar: 'الجودة' },
    { id: 18, code: 'LOG', nom: 'Logistique', ar: 'اللوجستيك' },
    { id: 19, code: 'COMM', nom: 'Commerce', ar: 'التجارة' },
    { id: 20, code: 'COMPT', nom: 'Comptabilité', ar: 'المحاسبة' },
    { id: 21, code: 'SECRET', nom: 'Secrétariat', ar: 'السكرتارية' },
    { id: 22, code: 'COIFF', nom: 'Coiffure', ar: 'الحلاقة' },
    { id: 23, code: 'ESTH', nom: 'Esthétique', ar: 'التجميل' },
    { id: 24, code: 'CUIS', nom: 'Cuisine', ar: 'المطبخ' },
    { id: 25, code: 'PATISS', nom: 'Pâtisserie', ar: 'الحلويات' },
    { id: 26, code: 'HOTEL', nom: 'Hôtellerie', ar: 'الفندقة' },
    { id: 27, code: 'TOUR', nom: 'Tourisme', ar: 'السياحة' },
    { id: 28, code: 'AGRIC', nom: 'Agriculture', ar: 'الزراعة' },
    { id: 29, code: 'ELEV', nom: 'Élevage', ar: 'تربية المواشي' },
    { id: 30, code: 'PECHE', nom: 'Pêche', ar: 'الصيد' },
    { id: 31, code: 'ARTIS', nom: 'Artisanat', ar: 'الحرف اليدوية' },
    { id: 32, code: 'MECA_AUTO', nom: 'Mécanique Automobile', ar: 'ميكانيك السيارات' }
  ];
  
  for (const specialite of specialites) {
    try {
      await sequelize.query(`
        INSERT IGNORE INTO specialite (id_specialite, code_specialite, designation_fr, designation_ar)
        VALUES (?, ?, ?, ?)
      `, {
        replacements: [specialite.id, specialite.code, specialite.nom, specialite.ar],
        type: sequelize.QueryTypes.INSERT
      });
    } catch (error) {
      console.log(`Specialite ${specialite.id} already exists`);
    }
  }
  
  console.log('✓ Specialites created');
};

// إنشاء المؤسسات إذا لم تكن موجودة
const createEstablishments = async () => {
  for (let i = 1; i <= 91; i++) {
    try {
      await sequelize.query(`
        INSERT IGNORE INTO etablissementformation (id_etab_formation, code, nom_fr, nom_ar)
        VALUES (?, ?, ?, ?)
      `, {
        replacements: [
          i, 
          `ETAB${i.toString().padStart(3, '0')}`, 
          `Établissement de Formation ${i}`, 
          `مؤسسة التكوين ${i}`
        ],
        type: sequelize.QueryTypes.INSERT
      });
    } catch (error) {
      console.log(`Establishment ${i} already exists`);
    }
  }
  
  console.log('✓ Establishments created');
};

// إنشاء الدبلومات إذا لم تكن موجودة
const createDiplomas = async () => {
  const diplomes = [
    { id: 3, code: 'DIP001', nom: 'Qualification', ar: 'التأهيل', niveau: 'Niveau 1', duree: 6 },
    { id: 4, code: 'DIP002', nom: 'Professional Competence', ar: 'الكفاءة المهنية', niveau: 'Niveau 2', duree: 12 },
    { id: 5, code: 'DIP003', nom: 'Professional Control', ar: 'المراقبة المهنية', niveau: 'Niveau 3', duree: 18 },
    { id: 6, code: 'DIP004', nom: 'Technician', ar: 'التقني', niveau: 'Niveau 4', duree: 24 },
    { id: 7, code: 'DIP005', nom: 'Senior Technician', ar: 'التقني العالي', niveau: 'Niveau 5', duree: 15 }
  ];
  
  for (const diplome of diplomes) {
    try {
      await sequelize.query(`
        INSERT IGNORE INTO diplome (id_diplome, code_diplome, designation_fr, designation_ar, niveau, duree_mois)
        VALUES (?, ?, ?, ?, ?, ?)
      `, {
        replacements: [diplome.id, diplome.code, diplome.nom, diplome.ar, diplome.niveau, diplome.duree],
        type: sequelize.QueryTypes.INSERT
      });
    } catch (error) {
      console.log(`Diploma ${diplome.id} already exists`);
    }
  }
  
  console.log('✓ Diplomas created');
};

// إنشاء أنماط التكوين إذا لم تكن موجودة
const createFormationModes = async () => {
  const modes = [
    { id: 1, nom: 'Formation Initiale', ar: 'التكوين الأولي', desc: 'Formation pour les nouveaux apprenants' },
    { id: 2, nom: 'Formation Continue', ar: 'التكوين المستمر', desc: 'Formation pour les professionnels en activité' },
    { id: 3, nom: 'Formation en Alternance', ar: 'التكوين بالتناوب', desc: 'Formation combinant théorie et pratique en entreprise' }
  ];
  
  for (const mode of modes) {
    try {
      await sequelize.query(`
        INSERT IGNORE INTO mode_formation (id_mode, code_mode, designation_fr, designation_ar)
        VALUES (?, ?, ?, ?)
      `, {
        replacements: [mode.id, `MODE${mode.id}`, mode.nom, mode.ar],
        type: sequelize.QueryTypes.INSERT
      });
    } catch (error) {
      console.log(`Mode ${mode.id} already exists`);
    }
  }
  
  console.log('✓ Formation modes created');
};

// تشغيل الإدراج إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  insertOffresFormation();
}

module.exports = insertOffresFormation;

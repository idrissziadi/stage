// check-specialites.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const checkSpecialites = async () => {
  try {
    console.log('🔍 Checking specialites table...');
    
    // فحص جميع التخصصات
    const [specialites] = await sequelize.query('SELECT id_specialite, code_specialite, designation_fr FROM specialite ORDER BY id_specialite');
    console.log(`\n📊 Total specialites: ${specialites.length}`);
    
    console.log('\n📋 All specialites:');
    specialites.forEach(spec => {
      console.log(`ID: ${spec.id_specialite}, Code: ${spec.code_specialite}, Name: ${spec.designation_fr}`);
    });
    
    // فحص النطاق المطلوب
    const [rangeSpecs] = await sequelize.query('SELECT id_specialite FROM specialite WHERE id_specialite BETWEEN 1 AND 31');
    console.log(`\n✅ Specialites in range 1-31: ${rangeSpecs.length}`);
    
    if (rangeSpecs.length < 31) {
      console.log('\n⚠️ Missing specialites. Creating them...');
      await createMissingSpecialites();
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

const createMissingSpecialites = async () => {
  const specialites = [
    { id: 1, code: 'MECA_AUTO', nom: 'Mécanique Automobile', ar: 'ميكانيك السيارات' },
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
    { id: 31, code: 'ARTIS', nom: 'Artisanat', ar: 'الحرف اليدوية' }
  ];
  
  let created = 0;
  for (const specialite of specialites) {
    try {
      await sequelize.query(`
        INSERT IGNORE INTO specialite (id_specialite, code_specialite, designation_fr, designation_ar)
        VALUES (?, ?, ?, ?)
      `, {
        replacements: [specialite.id, specialite.code, specialite.nom, specialite.ar],
        type: sequelize.QueryTypes.INSERT
      });
      created++;
      console.log(`✓ Created: ${specialite.nom}`);
    } catch (error) {
      console.log(`⚠️ ${specialite.nom} already exists`);
    }
  }
  
  console.log(`\n✅ Created ${created} new specialites`);
};

checkSpecialites();

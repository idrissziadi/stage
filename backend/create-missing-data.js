// create-missing-data.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const createMissingData = async () => {
  try {
    console.log('🔍 Creating missing data...');
    
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    // إنشاء الدبلومات المفقودة (1-2)
    console.log('📚 Creating missing diplomas...');
    const missingDiplomas = [
      { id: 1, code: 'CS', nom: 'Certificat de Spécialisation', ar: 'شهادة التخصص', niveau: 'Niveau 1', duree: 6 },
      { id: 2, code: 'BT', nom: 'Brevet de Technicien', ar: 'دبلوم التقني', niveau: 'Niveau 2', duree: 12 }
    ];

    for (const diplome of missingDiplomas) {
      try {
        await sequelize.query(`
          INSERT IGNORE INTO diplome (id_diplome, code_diplome, designation_fr, designation_ar, niveau, duree_mois)
          VALUES (?, ?, ?, ?, ?, ?)
        `, {
          replacements: [diplome.id, diplome.code, diplome.nom, diplome.ar, diplome.niveau, diplome.duree],
          type: sequelize.QueryTypes.INSERT
        });
        console.log(`✓ Created diploma: ${diplome.nom}`);
      } catch (error) {
        console.log(`⚠️ Diploma ${diplome.id} already exists`);
      }
    }

    // إنشاء المؤسسات المفقودة (67-91)
    console.log('🏫 Creating missing establishments...');
    for (let i = 67; i <= 91; i++) {
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
        console.log(`✓ Created establishment: ${i}`);
      } catch (error) {
        console.log(`⚠️ Establishment ${i} already exists`);
      }
    }

    // التحقق من البيانات
    console.log('\n🔍 Verifying data...');
    
    const [diplomeCount] = await sequelize.query('SELECT COUNT(*) as total FROM diplome WHERE id_diplome BETWEEN 1 AND 7');
    const [etabCount] = await sequelize.query('SELECT COUNT(*) as total FROM etablissementformation WHERE id_etab_formation BETWEEN 1 AND 91');
    
    console.log(`✓ Diplomas 1-7: ${diplomeCount[0].total}`);
    console.log(`✓ Establishments 1-91: ${etabCount[0].total}`);

    await sequelize.close();
    console.log('\n🎉 Missing data creation completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createMissingData();

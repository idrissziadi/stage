// check-data.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const checkData = async () => {
  try {
    console.log('🔍 Checking existing data in tables...');
    
    // فحص التخصصات
    const [specialites] = await sequelize.query('SELECT id_specialite, code_specialite, designation_fr FROM specialite ORDER BY id_specialite LIMIT 10');
    console.log('\n📋 Specialites (first 10):');
    console.table(specialites);
    
    // فحص الدبلومات
    const [diplomes] = await sequelize.query('SELECT id_diplome, code_diplome, designation_fr FROM diplome ORDER BY id_diplome LIMIT 10');
    console.log('\n📋 Diplomas (first 10):');
    console.table(diplomes);
    
    // فحص أنماط التكوين
    const [modes] = await sequelize.query('SELECT id_mode, code_mode, designation_fr FROM mode_formation ORDER BY id_mode LIMIT 10');
    console.log('\n📋 Formation Modes (first 10):');
    console.table(modes);
    
    // فحص المؤسسات
    const [etabs] = await sequelize.query('SELECT id_etab_formation, code, nom_fr FROM etablissementformation ORDER BY id_etab_formation LIMIT 10');
    console.log('\n📋 Establishments (first 10):');
    console.table(etabs);
    
    // إحصائيات عامة
    const [specialiteCount] = await sequelize.query('SELECT COUNT(*) as total FROM specialite');
    const [diplomeCount] = await sequelize.query('SELECT COUNT(*) as total FROM diplome');
    const [modeCount] = await sequelize.query('SELECT COUNT(*) as total FROM mode_formation');
    const [etabCount] = await sequelize.query('SELECT COUNT(*) as total FROM etablissementformation');
    
    console.log('\n📊 Summary:');
    console.log(`✓ Specialites: ${specialiteCount[0].total}`);
    console.log(`✓ Diplomas: ${diplomeCount[0].total}`);
    console.log(`✓ Formation Modes: ${modeCount[0].total}`);
    console.log(`✓ Establishments: ${etabCount[0].total}`);
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkData();

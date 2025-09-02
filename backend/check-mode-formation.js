// check-mode-formation.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const checkModeFormation = async () => {
  try {
    console.log('🔍 Checking Mode Formation table...');
    
    // فحص هيكل الجدول
    const [structure] = await sequelize.query('DESCRIBE mode_formation');
    console.log('\n📋 Table Structure:');
    console.table(structure);
    
    // فحص البيانات الموجودة
    const [data] = await sequelize.query('SELECT * FROM mode_formation');
    console.log('\n📊 Table Data:');
    if (data.length === 0) {
      console.log('❌ No data found in mode_formation table');
    } else {
      console.table(data);
    }
    
    // فحص عدد الصفوف
    const [count] = await sequelize.query('SELECT COUNT(*) as total FROM mode_formation');
    console.log(`\n📈 Total rows: ${count[0].total}`);
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkModeFormation();

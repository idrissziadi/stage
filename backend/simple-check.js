// simple-check.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const simpleCheck = async () => {
  try {
    console.log('🔍 Simple check of mode_formation...');
    
    // فحص عدد الصفوف
    const [countResult] = await sequelize.query('SELECT COUNT(*) as total FROM mode_formation');
    const total = countResult[0].total;
    console.log(`📊 Total rows: ${total}`);
    
    if (total > 0) {
      // فحص البيانات
      const [data] = await sequelize.query('SELECT id_mode, code_mode, designation_fr, designation_ar FROM mode_formation ORDER BY id_mode LIMIT 10');
      
      console.log('\n📋 First 10 rows:');
      data.forEach((row, index) => {
        console.log(`${index + 1}. ID: ${row.id_mode}, Code: ${row.code_mode}, FR: ${row.designation_fr}, AR: ${row.designation_ar}`);
      });
      
      if (total > 10) {
        console.log(`... and ${total - 10} more rows`);
      }
    } else {
      console.log('❌ Table is empty');
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

simpleCheck();

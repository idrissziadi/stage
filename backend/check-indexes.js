const { sequelize } = require('./config/database');

async function checkIndexes() {
  try {
    console.log('🔍 Checking database indexes...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check indexes on Compte table
    const [results] = await sequelize.query('SHOW INDEX FROM Compte');
    
    console.log('\n📊 Current indexes on Compte table:');
    console.log('Count:', results.length);
    
    const indexGroups = {};
    results.forEach(index => {
      if (!indexGroups[index.Key_name]) {
        indexGroups[index.Key_name] = [];
      }
      indexGroups[index.Key_name].push(index.Column_name);
    });

    console.log('\nIndexes by name:');
    Object.entries(indexGroups).forEach(([keyName, columns]) => {
      console.log(`- ${keyName}: [${columns.join(', ')}]`);
    });

    console.log('\n🔍 Checking foreign key constraints...');
    const [fkResults] = await sequelize.query(`
      SELECT 
        CONSTRAINT_NAME,
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE REFERENCED_TABLE_NAME = 'Compte'
    `);

    console.log('\n🔗 Foreign keys pointing to Compte table:');
    console.log('Count:', fkResults.length);
    fkResults.forEach(fk => {
      console.log(`- ${fk.TABLE_NAME}.${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkIndexes();
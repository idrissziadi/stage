// migrate-offre-status.js
require('dotenv').config();
const { sequelize } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function migrateOffreStatus() {
  try {
    console.log('🚀 Starting Offre status field migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', 'add_status_to_offre.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Remove comments and clean up the SQL
    const cleanSQL = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n');
    
    // Split SQL statements by semicolon and clean them
    const statements = cleanSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    console.log('Statements to execute:');
    statements.forEach((stmt, i) => {
      console.log(`${i + 1}. ${stmt.substring(0, 100)}${stmt.length > 100 ? '...' : ''}`);
    });
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await sequelize.query(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error) {
          if (error.message.includes('Duplicate column name') || 
              error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}/${statements.length} skipped (already exists)`);
          } else {
            throw error;
          }
        }
      }
    }
    
    // Verify the migration by checking if column exists first
    try {
      const result = await sequelize.query(`
        SELECT COUNT(*) as count, statut 
        FROM Offre 
        GROUP BY statut
      `);
      
      console.log('📊 Migration verification:');
      console.table(result[0]);
    } catch (error) {
      if (error.message.includes('Unknown column')) {
        console.log('⚠️  Column statut does not exist yet - this indicates the migration may have failed');
        throw new Error('Migration appears to have failed - statut column was not created');
      }
      throw error;
    }
    
    console.log('✅ Offre status field migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateOffreStatus()
    .then(() => {
      console.log('🎉 Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateOffreStatus };
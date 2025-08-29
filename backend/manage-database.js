const { sequelize } = require('./config/database');
const setupAssociations = require('./models/associations');

// Import all models
require('./models/Compte');
require('./models/Enseignant');
require('./models/Stagiaire');
require('./models/EtablissementFormation');
require('./models/EtablissementRegionale');
require('./models/EtablissementNationale');
require('./models/Branche');
require('./models/Specialite');
require('./models/Module');
require('./models/Cours');
require('./models/Memoire');
require('./models/Programme');
require('./models/Offre');
require('./models/Inscription');
require('./models/SpecialiteEtab');
require('./models/Ens_Module');
require('./models/Grade');
require('./models/Diplome');
require('./models/TokenBlacklist');

// Setup associations
setupAssociations();

async function manageDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Get command line argument
    const command = process.argv[2] || 'check';

    switch (command) {
      case 'check':
        await checkDatabaseStatus();
        break;
      case 'reset':
        await resetDatabase();
        break;
      case 'create':
        await createTables();
        break;
      case 'indexes':
        await checkIndexes();
        break;
      default:
        console.log('Available commands:');
        console.log('  check   - Check database status');
        console.log('  reset   - Reset database (drops all tables)');
        console.log('  create  - Create tables if they don\'t exist');
        console.log('  indexes - Check table indexes');
        console.log('');
        console.log('Usage: node manage-database.js [command]');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.parent) {
      console.error('Database error:', error.parent.message);
    }
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

async function checkDatabaseStatus() {
  console.log('🔍 Checking database status...');
  
  const tableExists = await sequelize.getQueryInterface().showAllTables();
  console.log(`📊 Found ${tableExists.length} tables`);
  
  if (tableExists.length > 0) {
    console.log('Tables:', tableExists.join(', '));
  } else {
    console.log('No tables found - database needs initialization');
  }
}

async function resetDatabase() {
  console.log('⚠️  WARNING: This will delete ALL data!');
  console.log('🗑️  Dropping all tables...');
  await sequelize.drop();
  console.log('✅ All tables dropped');

  console.log('🏗️  Creating tables from scratch...');
  await sequelize.sync({ force: true });
  console.log('✅ All tables created successfully');
}

async function createTables() {
  console.log('🏗️  Creating tables (safe mode)...');
  
  const tableExists = await sequelize.getQueryInterface().showAllTables();
  
  if (tableExists.length === 0) {
    await sequelize.sync({ force: false });
    console.log('✅ Tables created successfully');
  } else {
    console.log('⚠️  Tables already exist, skipping creation');
    console.log('Use "reset" command to recreate tables');
  }
}

async function checkIndexes() {
  console.log('🔍 Checking indexes on all tables...');
  
  const tables = await sequelize.getQueryInterface().showAllTables();
  
  for (const table of tables) {
    try {
      const [results] = await sequelize.query(`SHOW INDEX FROM ${table}`);
      console.log(`\n📊 ${table}: ${results.length} indexes`);
      
      if (results.length > 10) {
        console.log(`⚠️  Warning: ${table} has many indexes (${results.length})`);
      }
      
      // Group by index name
      const indexGroups = {};
      results.forEach(index => {
        if (!indexGroups[index.Key_name]) {
          indexGroups[index.Key_name] = [];
        }
        indexGroups[index.Key_name].push(index.Column_name);
      });
      
      Object.entries(indexGroups).forEach(([keyName, columns]) => {
        console.log(`  - ${keyName}: [${columns.join(', ')}]`);
      });
      
    } catch (error) {
      console.log(`❌ Error checking indexes for ${table}: ${error.message}`);
    }
  }
}

manageDatabase();
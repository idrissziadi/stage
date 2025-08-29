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

async function resetDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('🗑️  Dropping all tables...');
    await sequelize.drop();
    console.log('✅ All tables dropped');

    console.log('🏗️  Creating tables from scratch...');
    await sequelize.sync({ force: true });
    console.log('✅ All tables created successfully');

    console.log('🎉 Database reset complete!');
    
  } catch (error) {
    console.error('❌ Error during database reset:', error.message);
    if (error.parent) {
      console.error('Database error:', error.parent.message);
    }
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

resetDatabase();
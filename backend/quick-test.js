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

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    console.log('🔧 Synchronizing models...');
    await sequelize.sync({ alter: true });
    console.log('✅ All models synchronized successfully!');

    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.parent) {
      console.error('Database error:', error.parent.message);
    }
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

testConnection();
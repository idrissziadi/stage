const { sequelize } = require('./config/database');
const setupAssociations = require('./models/associations');

// Import models
require('./models/Compte');
require('./models/Enseignant');
require('./models/Module');
require('./models/Cours');

// Setup associations
setupAssociations();

const Cours = require('./models/Cours');
const Module = require('./models/Module');
const Enseignant = require('./models/Enseignant');

async function testCourseCreation() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('Syncing models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');

    // Test basic course creation
    console.log('\nTesting course creation...');
    
    // First, check if we have modules and enseignants
    const modules = await Module.findAll({ limit: 1 });
    console.log('Available modules:', modules.length);
    
    const enseignants = await Enseignant.findAll({ limit: 1 });
    console.log('Available enseignants:', enseignants.length);
    
    if (modules.length === 0 || enseignants.length === 0) {
      console.log('❌ No modules or enseignants found. Cannot test course creation.');
      return;
    }

    const testCourseData = {
      code_cours: 'TEST_' + Date.now(),
      titre_fr: 'Test Course',
      titre_ar: 'درس تجريبي',
      id_module: modules[0].id_module,
      id_enseignant: enseignants[0].id_enseignant,
      fichierpdf: 'test/path/file.pdf',
      status: 'في_الانتظار',
      observation: 'Test observation'
    };

    console.log('Creating course with data:', testCourseData);
    
    const cours = await Cours.create(testCourseData);
    console.log('✅ Course created successfully:', cours.id_cours);
    
    // Test with relations
    const coursWithRelations = await Cours.findByPk(cours.id_cours, {
      include: [
        {
          model: Module,
          as: 'module',
          attributes: ['designation_fr', 'designation_ar', 'code_module']
        },
        {
          model: Enseignant,
          as: 'enseignant',
          attributes: ['nom_fr', 'prenom_fr']
        }
      ]
    });
    
    console.log('✅ Course with relations:', JSON.stringify(coursWithRelations, null, 2));
    
    // Clean up
    await cours.destroy();
    console.log('✅ Test course deleted');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors.map(e => e.message));
    }
  } finally {
    await sequelize.close();
  }
}

testCourseCreation();
// assign-modules-to-enseignant.js
require('dotenv').config();
const { sequelize } = require('./config/database');
const Ens_Module = require('./models/Ens_Module');
const Module = require('./models/Module');
const Enseignant = require('./models/Enseignant');

// Setup associations
require('./models/associations')();

const assignModulesToEnseignant = async () => {
  console.log('🚀 Starting module assignment to enseignant...');
  
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');
    
    // Find the first enseignant (or specify an ID)
    const enseignant = await Enseignant.findOne({
      where: { id_enseignant: 1 } // Change this ID as needed
    });
    
    if (!enseignant) {
      console.log('❌ No enseignant found. Please check the database.');
      return;
    }
    
    console.log(`✓ Found enseignant: ${enseignant.nom_fr} ${enseignant.prenom_fr} (ID: ${enseignant.id_enseignant})`);
    
    // Find available modules
    const modules = await Module.findAll({
      limit: 5 // Assign 5 modules for testing
    });
    
    if (modules.length === 0) {
      console.log('❌ No modules found. Please check the database.');
      return;
    }
    
    console.log(`✓ Found ${modules.length} modules to assign`);
    
    // Create assignments for the current school year
    const currentYear = new Date().getFullYear();
    const annee_scolaire = `${currentYear}-09-01`; // September 1st of current year
    
    const assignments = modules.map(module => ({
      id_module: module.id_module,
      id_enseignant: enseignant.id_enseignant,
      annee_scolaire: annee_scolaire,
      semestre: 'S1' // First semester
    }));
    
    console.log(`📚 Creating ${assignments.length} module assignments...`);
    
    // Insert assignments
    const createdAssignments = await Ens_Module.bulkCreate(assignments, {
      ignoreDuplicates: true
    });
    
    console.log(`✅ Successfully created ${createdAssignments.length} module assignments`);
    
    // Verify the assignments
    const verifyAssignments = await Ens_Module.findAll({
      where: { id_enseignant: enseignant.id_enseignant },
      include: [{
        model: Module,
        as: 'module',
        attributes: ['code_module', 'designation_fr', 'designation_ar']
      }]
    });
    
    console.log('\n📊 Current module assignments:');
    verifyAssignments.forEach(assignment => {
      console.log(`   • ${assignment.module.code_module}: ${assignment.module.designation_fr} (${assignment.module.designation_ar})`);
      console.log(`     Semestre: ${assignment.semestre}, Année: ${assignment.annee_scolaire}`);
    });
    
    await sequelize.close();
    console.log('\n🎉 Module assignment completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during module assignment:', error.message);
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  assignModulesToEnseignant();
}

module.exports = assignModulesToEnseignant;

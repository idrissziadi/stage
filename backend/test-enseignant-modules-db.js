// test-enseignant-modules-db.js
require('dotenv').config();
const { sequelize } = require('./config/database');
const Ens_Module = require('./models/Ens_Module');
const Module = require('./models/Module');
const Enseignant = require('./models/Enseignant');

// Setup associations
require('./models/associations')();

const testEnseignantModules = async () => {
  console.log('🔍 Testing enseignant modules in database...');
  
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');
    
    // Check if enseignant exists
    const enseignant = await Enseignant.findByPk(1);
    if (!enseignant) {
      console.log('❌ Enseignant with ID 1 not found');
      return;
    }
    console.log(`✓ Found enseignant: ${enseignant.nom_fr} ${enseignant.prenom_fr} (ID: ${enseignant.id_enseignant})`);
    
    // Check Ens_Module table
    console.log('\n📊 Checking Ens_Module table...');
    const ensModules = await Ens_Module.findAll({
      where: { id_enseignant: 1 }
    });
    console.log(`✓ Found ${ensModules.length} records in Ens_Module for enseignant 1`);
    
    if (ensModules.length > 0) {
      console.log('📋 Ens_Module records:');
      ensModules.forEach((em, index) => {
        console.log(`   ${index + 1}. Module ID: ${em.id_module}, Année: ${em.annee_scolaire}, Semestre: ${em.semestre}`);
      });
    }
    
    // Check Module table
    console.log('\n📚 Checking Module table...');
    const modules = await Module.findAll({
      limit: 5
    });
    console.log(`✓ Found ${modules.length} modules in Module table`);
    
    if (modules.length > 0) {
      console.log('📋 Sample modules:');
      modules.forEach((m, index) => {
        console.log(`   ${index + 1}. ID: ${m.id_module}, Code: ${m.code_module}, Designation: ${m.designation_fr}`);
      });
    }
    
    // Check with associations
    console.log('\n🔗 Checking with associations...');
    const ensModulesWithAssoc = await Ens_Module.findAll({
      where: { id_enseignant: 1 },
      include: [{
        model: Module,
        as: 'module',
        attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar']
      }]
    });
    
    console.log(`✓ Found ${ensModulesWithAssoc.length} Ens_Module records with Module associations`);
    
    if (ensModulesWithAssoc.length > 0) {
      console.log('📋 Ens_Module with Module details:');
      ensModulesWithAssoc.forEach((em, index) => {
        if (em.module) {
          console.log(`   ${index + 1}. Module: ${em.module.code_module} - ${em.module.designation_fr}`);
          console.log(`      Année: ${em.annee_scolaire}, Semestre: ${em.semestre}`);
        } else {
          console.log(`   ${index + 1}. Module association is null`);
        }
      });
    }
    
    // Check if there are any modules that could be assigned
    console.log('\n🔍 Checking if there are modules that could be assigned...');
    const allModules = await Module.findAll({
      limit: 10
    });
    
    if (allModules.length > 0) {
      console.log(`✓ Found ${allModules.length} total modules available`);
      console.log('📋 Available modules for assignment:');
      allModules.slice(0, 5).forEach((m, index) => {
        console.log(`   ${index + 1}. ID: ${m.id_module}, Code: ${m.code_module}, Designation: ${m.designation_fr}`);
      });
    }
    
    await sequelize.close();
    console.log('\n🎉 Database check completed!');
    
  } catch (error) {
    console.error('❌ Error during database check:', error.message);
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  testEnseignantModules();
}

module.exports = testEnseignantModules;

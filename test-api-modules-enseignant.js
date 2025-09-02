const { sequelize } = require('./backend/config/database');

async function testModulesEnseignant() {
  try {
    console.log('🧪 Test de l\'API Modules des Enseignants\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const Enseignant = sequelize.models.Enseignant;
    const Ens_Module = sequelize.models.Ens_Module;
    const Module = sequelize.models.Module;
    
    // 1. Vérifier s'il y a des assignations dans Ens_Module
    const totalEnsModules = await Ens_Module.count();
    console.log(`📊 Total des assignations dans Ens_Module: ${totalEnsModules}`);
    
    if (totalEnsModules > 0) {
      // 2. Trouver un exemple d'assignation
      const sampleEnsModule = await Ens_Module.findOne({
        include: [{
          model: Enseignant,
          as: 'enseignant',
          attributes: ['id_enseignant', 'nom_fr', 'prenom_fr']
        }, {
          model: Module,
          as: 'module',
          attributes: ['id_module', 'code_module', 'designation_fr']
        }]
      });
      
      console.log('🔍 Exemple d\'assignation:');
      console.log(`   Enseignant: ${sampleEnsModule.enseignant.prenom_fr} ${sampleEnsModule.enseignant.nom_fr} (ID: ${sampleEnsModule.enseignant.id_enseignant})`);
      console.log(`   Module: ${sampleEnsModule.module.designation_fr} (${sampleEnsModule.module.code_module})`);
      console.log(`   Semestre: ${sampleEnsModule.semestre}, Année: ${sampleEnsModule.annee_scolaire}`);
      
      // 3. Tester l'API pour cet enseignant
      const enseignantId = sampleEnsModule.enseignant.id_enseignant;
      console.log(`\n🧪 Test de l'API pour l'enseignant ID: ${enseignantId}`);
      
      const ensModules = await Ens_Module.findAll({
        where: { id_enseignant: enseignantId },
        include: [{
          model: Module,
          as: 'module',
          attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar']
        }],
        order: [['annee_scolaire', 'DESC'], ['semestre', 'ASC']]
      });
      
      console.log(`📚 Modules assignés trouvés: ${ensModules.length}`);
      
      if (ensModules.length > 0) {
        console.log('\n📋 Détails des modules assignés:');
        ensModules.forEach((em, index) => {
          console.log(`   ${index + 1}. ${em.module.designation_fr} (${em.module.code_module})`);
          console.log(`      Semestre: ${em.semestre || 'N/A'}`);
          console.log(`      Année: ${em.annee_scolaire || 'N/A'}`);
          console.log('');
        });
      }
    } else {
      console.log('⚠️ Aucune assignation de module trouvée dans Ens_Module');
    }
    
    // 4. Vérifier les associations
    console.log('\n🔗 Vérification des associations:');
    console.log('   Ens_Module -> Module:', Ens_Module.associations.module ? '✅ Présente' : '❌ Absente');
    console.log('   Ens_Module -> Enseignant:', Ens_Module.associations.enseignant ? '✅ Présente' : '❌ Absente');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testModulesEnseignant();

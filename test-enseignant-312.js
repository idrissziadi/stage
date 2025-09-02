const { sequelize } = require('./backend/config/database');

async function testEnseignant312() {
  try {
    console.log('🧪 Test pour l\'Enseignant ID: 312 (Adil BENABDALLAH)\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const Enseignant = sequelize.models.Enseignant;
    const Ens_Module = sequelize.models.Ens_Module;
    const Module = sequelize.models.Module;
    
    // 1. Vérifier l'enseignant ID 312
    const enseignant = await Enseignant.findByPk(312, {
      attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'email']
    });
    
    if (!enseignant) {
      console.log('❌ Enseignant ID 312 non trouvé');
      return;
    }
    
    console.log(`✅ Enseignant trouvé: ${enseignant.prenom_fr} ${enseignant.nom_fr}`);
    console.log(`   Email: ${enseignant.email}`);
    console.log('');
    
    // 2. Vérifier les modules assignés à cet enseignant
    const ensModules = await Ens_Module.findAll({
      where: { id_enseignant: 312 },
      include: [{
        model: Module,
        as: 'module',
        attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar']
      }],
      order: [['annee_scolaire', 'DESC'], ['semestre', 'ASC']]
    });
    
    console.log(`📚 Modules assignés à l'enseignant 312: ${ensModules.length}`);
    
    if (ensModules.length > 0) {
      console.log('\n📋 Détails des modules assignés:');
      ensModules.forEach((em, index) => {
        console.log(`   ${index + 1}. ${em.module.designation_fr} (${em.module.code_module})`);
        console.log(`      Semestre: ${em.semestre || 'N/A'}`);
        console.log(`      Année: ${em.annee_scolaire || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ Aucun module assigné à cet enseignant');
    }
    
    // 3. Vérifier tous les enseignants avec modules
    console.log('\n🔍 Tous les enseignants avec modules assignés:');
    const allEnsModules = await Ens_Module.findAll({
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
    
    const enseignantsAvecModules = {};
    allEnsModules.forEach(em => {
      const enseignantId = em.enseignant.id_enseignant;
      if (!enseignantsAvecModules[enseignantId]) {
        enseignantsAvecModules[enseignantId] = {
          nom: `${em.enseignant.prenom_fr} ${em.enseignant.nom_fr}`,
          modules: []
        };
      }
      enseignantsAvecModules[enseignantId].modules.push({
        id: em.module.id_module,
        code: em.module.code_module,
        nom: em.module.designation_fr
      });
    });
    
    Object.entries(enseignantsAvecModules).forEach(([id, data]) => {
      console.log(`   Enseignant ${id} (${data.nom}): ${data.modules.length} modules`);
      data.modules.forEach(module => {
        console.log(`     - ${module.nom} (${module.code})`);
      });
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testEnseignant312();

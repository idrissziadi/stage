const { sequelize } = require('./backend/config/database');

async function testAPIEnseignant403() {
  try {
    console.log('🧪 Test de l\'API Backend pour l\'Enseignant ID: 403\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const Enseignant = sequelize.models.Enseignant;
    const Ens_Module = sequelize.models.Ens_Module;
    const Module = sequelize.models.Module;
    
    // 1. Simuler exactement la logique de l'API getModulesByEnseignant
    const id_enseignant = 403;
    const annee_scolaire = null; // Pas de filtre par année
    
    console.log(`🔍 Simulation de l'API getModulesByEnseignant pour l'enseignant ${id_enseignant}`);
    
    let whereClause = { id_enseignant };
    if (annee_scolaire) {
      whereClause.annee_scolaire = annee_scolaire;
    }
    
    console.log('🔍 Clause WHERE:', whereClause);
    
    // 2. Exécuter la requête exacte de l'API
    const ensModules = await Ens_Module.findAll({
      where: whereClause,
      include: [{
        model: Module,
        as: 'module',
        attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar'],
        include: [{
          model: sequelize.models.Specialite,
          as: 'specialite',
          attributes: ['id_specialite', 'designation_fr', 'designation_ar']
        }]
      }],
      order: [['annee_scolaire', 'DESC'], ['semestre', 'ASC']]
    });
    
    console.log(`📚 Modules trouvés: ${ensModules.length}`);
    console.log('📊 Données brutes:', JSON.stringify(ensModules, null, 2));
    
    // 3. Extraire les modules dans le format attendu par le frontend
    const modules = ensModules.map(ensModule => ({
      id_module: ensModule.module.id_module,
      code_module: ensModule.module.code_module,
      designation_fr: ensModule.module.designation_fr,
      designation_ar: ensModule.module.designation_ar,
      specialite: ensModule.module.specialite,
      semestre: ensModule.semestre,
      annee_scolaire: ensModule.annee_scolaire,
      assigned_at: ensModule.createdAt
    }));
    
    console.log('\n🎯 Modules extraits:', modules.length);
    console.log('📋 Détails des modules:');
    modules.forEach((module, index) => {
      console.log(`   ${index + 1}. ${module.designation_fr} (${module.code_module})`);
      console.log(`      Semestre: ${module.semestre}, Année: ${module.annee_scolaire}`);
      console.log(`      Spécialité: ${module.specialite?.designation_fr || 'N/A'}`);
    });
    
    // 4. Simuler la réponse API finale
    const response = { data: modules };
    console.log('\n📤 Réponse API finale:');
    console.log(JSON.stringify(response, null, 2));
    
    // 5. Vérifier que c'est un tableau valide
    console.log('\n✅ Validation de la réponse:');
    console.log(`   Type de response.data: ${typeof response.data}`);
    console.log(`   Est un tableau: ${Array.isArray(response.data)}`);
    console.log(`   Longueur: ${response.data.length}`);
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('✅ SUCCÈS: L\'API retourne un tableau valide avec des modules');
    } else {
      console.log('❌ ÉCHEC: L\'API ne retourne pas un tableau valide');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testAPIEnseignant403();

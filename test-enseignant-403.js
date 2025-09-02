const { sequelize } = require('./backend/config/database');

async function testEnseignant403() {
  try {
    console.log('🧪 Test spécifique pour l\'Enseignant ID: 403\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const Enseignant = sequelize.models.Enseignant;
    const Ens_Module = sequelize.models.Ens_Module;
    const Module = sequelize.models.Module;
    
    // 1. Vérifier l'enseignant ID 403
    const enseignant = await Enseignant.findByPk(403, {
      attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'email', 'id_etab_formation'],
      include: [{
        model: sequelize.models.EtablissementFormation,
        as: 'etablissementFormation',
        attributes: ['id_etab_formation', 'nom_fr', 'nom_ar']
      }]
    });
    
    if (!enseignant) {
      console.log('❌ Enseignant ID 403 non trouvé');
      return;
    }
    
    console.log(`✅ Enseignant trouvé: ${enseignant.prenom_fr} ${enseignant.nom_fr}`);
    console.log(`   Email: ${enseignant.email}`);
    console.log(`   Établissement: ${enseignant.etablissementFormation?.nom_fr || 'Non assigné'}`);
    console.log('');
    
    // 2. Vérifier les modules assignés à cet enseignant
    const ensModules = await Ens_Module.findAll({
      where: { id_enseignant: 403 },
      include: [{
        model: Module,
        as: 'module',
        attributes: ['id_module', 'code_module', 'designation_fr', 'designation_ar']
      }],
      order: [['annee_scolaire', 'DESC'], ['semestre', 'ASC']]
    });
    
    console.log(`📚 Modules assignés à l'enseignant 403: ${ensModules.length}`);
    
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
      
      // 3. Vérifier s'il y a des modules disponibles pour son établissement
      if (enseignant.id_etab_formation) {
        console.log('\n🔍 Vérification des modules disponibles pour son établissement...');
        
        const modulesDisponibles = await sequelize.query(`
          SELECT DISTINCT m.id_module, m.code_module, m.designation_fr, m.designation_ar
          FROM Module m
          INNER JOIN Specialite s ON m.id_specialite = s.id_specialite
          INNER JOIN Offre o ON s.id_specialite = o.id_specialite
          WHERE o.id_etab_formation = :id_etab_formation
          AND o.statut IN ('active', 'brouillon')
        `, {
          replacements: { id_etab_formation: enseignant.id_etab_formation },
          type: sequelize.QueryTypes.SELECT
        });
        
        console.log(`📊 Modules disponibles pour l'établissement: ${modulesDisponibles.length}`);
        
        if (modulesDisponibles.length > 0) {
          console.log('\n📋 Modules disponibles:');
          modulesDisponibles.slice(0, 5).forEach((module, index) => {
            console.log(`   ${index + 1}. ${module.designation_fr} (${module.code_module})`);
          });
          if (modulesDisponibles.length > 5) {
            console.log(`   ... et ${modulesDisponibles.length - 5} autres`);
          }
        }
      }
    }
    
    // 4. Vérifier la structure de la réponse API
    console.log('\n🔍 Test de la structure de réponse API:');
    
    // Simuler l'appel API getModulesByEnseignant
    const modulesResponse = {
      data: ensModules.map(em => ({
        id_module: em.module.id_module,
        code_module: em.module.code_module,
        designation_fr: em.module.designation_fr,
        designation_ar: em.module.designation_ar,
        semestre: em.semestre,
        annee_scolaire: em.annee_scolaire
      }))
    };
    
    console.log('📤 Réponse API simulée:');
    console.log(JSON.stringify(modulesResponse, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testEnseignant403();

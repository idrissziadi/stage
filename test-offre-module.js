const { sequelize } = require('./backend/config/database');

async function testOffreModule() {
  try {
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles après configuration des associations
    const Offre = sequelize.models.Offre;
    const Module = sequelize.models.Module;
    const OffreModule = sequelize.models.OffreModule;
    const Inscription = sequelize.models.Inscription;
    const Stagiaire = sequelize.models.Stagiaire;
    
    console.log('🧪 Test de la table OffreModule...\n');
    
    // 1. Vérifier le nombre total d'enregistrements
    const totalOffreModules = await OffreModule.count();
    console.log(`📊 Total des associations OffreModule: ${totalOffreModules}`);
    
    // 2. Vérifier quelques associations sans include
    const sampleAssociations = await OffreModule.findAll({
      limit: 5,
      attributes: ['id_offre', 'id_module']
    });
    
    console.log('\n🔍 Exemples d\'associations:');
    for (const assoc of sampleAssociations) {
      console.log(`   Offre ${assoc.id_offre} ↔ Module ${assoc.id_module}`);
    }
    
    // 3. Tester la logique de récupération des modules pour une offre
    if (sampleAssociations.length > 0) {
      const testOffreId = sampleAssociations[0].id_offre;
      console.log(`\n🧪 Test de récupération des modules pour l'offre ${testOffreId}:`);
      
      const modulesForOffre = await OffreModule.findAll({
        where: { id_offre: testOffreId },
        attributes: ['id_module']
      });
      
      console.log(`   Modules trouvés: ${modulesForOffre.length}`);
      const moduleIds = modulesForOffre.map(om => om.id_module);
      console.log(`   IDs des modules: ${moduleIds.join(', ')}`);
    }
    
    // 4. Tester la logique de récupération des offres pour un module
    if (sampleAssociations.length > 0) {
      const testModuleId = sampleAssociations[0].id_module;
      console.log(`\n🧪 Test de récupération des offres pour le module ${testModuleId}:`);
      
      const offresForModule = await OffreModule.findAll({
        where: { id_module: testModuleId },
        attributes: ['id_offre']
      });
      
      console.log(`   Offres trouvées: ${offresForModule.length}`);
      const offreIds = offresForModule.map(om => om.id_offre);
      console.log(`   IDs des offres: ${offreIds.join(', ')}`);
    }
    
    console.log('\n✅ Test terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testOffreModule();

const { sequelize } = require('./backend/config/database');

async function testAPICorrected() {
  try {
    console.log('🧪 Test de l\'API corrigée - Vérification de la logique\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const Stagiaire = sequelize.models.Stagiaire;
    const Inscription = sequelize.models.Inscription;
    const OffreModule = sequelize.models.OffreModule;
    const Cours = sequelize.models.Cours;
    
    // Simuler exactement la logique de getCoursByStagiaire
    console.log('🔍 Simulation de getCoursByStagiaire pour stagiaire ID 25...\n');
    
    // 1. Récupérer les inscriptions du stagiaire
    const inscriptions = await Inscription.findAll({
      where: { id_stagiaire: 25 },
      attributes: ['id_offre']
    });
    
    console.log(`📋 Inscriptions trouvées: ${inscriptions.length}`);
    
    if (inscriptions.length === 0) {
      console.log('⚠️ Aucune inscription trouvée pour le stagiaire');
      return;
    }
    
    // 2. Extraire les IDs des offres
    const offreIds = inscriptions.map(inscription => inscription.id_offre);
    console.log(`🎯 IDs des offres: ${offreIds.join(', ')}`);
    
    // 3. Récupérer les modules via OffreModule
    const offreModules = await OffreModule.findAll({
      where: { 
        id_offre: { [sequelize.Sequelize.Op.in]: offreIds }
      },
      attributes: ['id_module']
    });
    
    const moduleIds = offreModules.map(om => om.id_module);
    console.log(`📚 Modules trouvés via OffreModule: ${moduleIds.length}`);
    console.log(`   IDs des modules: ${moduleIds.join(', ')}`);
    
    if (moduleIds.length === 0) {
      console.log('⚠️ Aucun module trouvé pour les offres');
      return;
    }
    
    // 4. Récupérer les cours approuvés pour ces modules
    const cours = await Cours.findAll({
      where: { 
        id_module: { [sequelize.Sequelize.Op.in]: moduleIds },
        status: 'مقبول'
      },
      attributes: ['id_cours', 'titre_fr', 'id_module', 'status']
    });
    
    console.log(`✅ Cours trouvés: ${cours.length}`);
    
    if (cours.length > 0) {
      console.log('\n📚 Détails des cours:');
      cours.forEach((c, index) => {
        console.log(`   ${index + 1}. ${c.titre_fr || 'Sans titre'} (Module: ${c.id_module}, Status: ${c.status})`);
      });
    }
    
    console.log('\n🎯 Résumé du test:');
    console.log(`   ✅ Inscriptions: ${inscriptions.length}`);
    console.log(`   ✅ Offres: ${offreIds.length}`);
    console.log(`   ✅ Modules: ${moduleIds.length}`);
    console.log(`   ✅ Cours: ${cours.length}`);
    
    if (cours.length > 0) {
      console.log('\n🚀 SUCCÈS ! L\'API devrait maintenant fonctionner sans erreur 500.');
      console.log('   Testez l\'onglet "دروسي" dans l\'interface stagiaire.');
    } else {
      console.log('\n⚠️ ATTENTION : Aucun cours trouvé. Vérifiez les données de la base.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('\n💥 L\'erreur persiste. Vérifiez les logs du serveur backend.');
  } finally {
    await sequelize.close();
  }
}

testAPICorrected();

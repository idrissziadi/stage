const { sequelize } = require('./backend/config/database');

async function testStagiaireAPI() {
  try {
    console.log('🧪 Test de l\'API Stagiaire - Logique simplifiée\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const Stagiaire = sequelize.models.Stagiaire;
    const Inscription = sequelize.models.Inscription;
    const OffreModule = sequelize.models.OffreModule;
    const Cours = sequelize.models.Cours;
    
    // 1. Trouver un stagiaire de test
    const stagiaire = await Stagiaire.findOne({
      attributes: ['id_stagiaire', 'compte_id']
    });
    
    if (!stagiaire) {
      console.log('❌ Aucun stagiaire trouvé dans la base');
      return;
    }
    
    console.log(`✅ Stagiaire de test trouvé: ID ${stagiaire.id_stagiaire} (Compte: ${stagiaire.compte_id})`);
    
    // 2. Récupérer ses inscriptions
    const inscriptions = await Inscription.findAll({
      where: { id_stagiaire: stagiaire.id_stagiaire },
      attributes: ['id_offre']
    });
    
    console.log(`📋 Inscriptions trouvées: ${inscriptions.length}`);
    
    if (inscriptions.length === 0) {
      console.log('⚠️ Aucune inscription trouvée pour ce stagiaire');
      return;
    }
    
    // 3. Extraire les IDs des offres
    const offreIds = inscriptions.map(inscription => inscription.id_offre);
    console.log(`🎯 IDs des offres: ${offreIds.join(', ')}`);
    
    // 4. Récupérer les modules via OffreModule
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
    
    // 5. Récupérer les cours approuvés pour ces modules
    const cours = await Cours.findAll({
      where: { 
        id_module: { [sequelize.Sequelize.Op.in]: moduleIds },
        status: 'مقبول'
      },
      attributes: ['id_cours', 'titre_fr', 'id_module', 'status']
    });
    
    console.log(`✅ Cours trouvés: ${cours.length}`);
    cours.forEach(c => {
      console.log(`   - ${c.titre_fr} (Module: ${c.id_module}, Status: ${c.status})`);
    });
    
    console.log('\n🎯 Résumé du chemin OffreModule → Module → Cours:');
    console.log(`   Inscriptions: ${inscriptions.length}`);
    console.log(`   Offres: ${offreIds.length}`);
    console.log(`   Modules: ${moduleIds.length}`);
    console.log(`   Cours: ${cours.length}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testStagiaireAPI();

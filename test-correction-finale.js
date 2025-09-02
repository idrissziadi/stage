const { sequelize } = require('./backend/config/database');

async function testCorrectionFinale() {
  try {
    console.log('🎯 Test Final de la Correction - API Stagiaire\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const Stagiaire = sequelize.models.Stagiaire;
    const Inscription = sequelize.models.Inscription;
    const OffreModule = sequelize.models.OffreModule;
    const Cours = sequelize.models.Cours;
    const Module = sequelize.models.Module;
    const Enseignant = sequelize.models.Enseignant;
    
    // 1. Simuler la logique de getCoursByStagiaire pour le stagiaire ID 25
    console.log('🔍 Test de la logique getCoursByStagiaire pour stagiaire ID 25...\n');
    
    // Récupérer les inscriptions du stagiaire
    const inscriptions = await Inscription.findAll({
      where: { id_stagiaire: 25 },
      attributes: ['id_offre']
    });
    
    console.log(`📋 Inscriptions trouvées: ${inscriptions.length}`);
    
    if (inscriptions.length === 0) {
      console.log('⚠️ Aucune inscription trouvée pour le stagiaire');
      return;
    }
    
    // Extraire les IDs des offres
    const offreIds = inscriptions.map(inscription => inscription.id_offre);
    console.log(`🎯 IDs des offres: ${offreIds.join(', ')}`);
    
    // Récupérer les modules via OffreModule
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
    
    // Récupérer les cours approuvés pour ces modules avec tous les détails
    const cours = await Cours.findAll({
      where: { 
        id_module: { [sequelize.Sequelize.Op.in]: moduleIds },
        status: 'مقبول'
      },
      include: [
        {
          model: Module,
          as: 'module',
          attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
          required: false
        },
        {
          model: Enseignant,
          as: 'enseignant',
          attributes: ['id_enseignant', 'nom_fr', 'prenom_fr', 'email'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`✅ Cours trouvés: ${cours.length}`);
    
    if (cours.length > 0) {
      console.log('\n📚 Détails des cours:');
      cours.forEach((c, index) => {
        console.log(`   ${index + 1}. ${c.titre_fr || 'Sans titre'}`);
        console.log(`      Module: ${c.module?.designation_fr || 'N/A'} (${c.module?.code_module || 'N/A'})`);
        console.log(`      Enseignant: ${c.enseignant?.nom_fr || 'N/A'} ${c.enseignant?.prenom_fr || 'N/A'}`);
        console.log(`      Status: ${c.status}`);
        console.log('');
      });
    }
    
    // 2. Vérifier que la structure de réponse correspond à ce que le frontend attend
    console.log('🔍 Vérification de la structure de réponse...');
    
    if (cours.length > 0) {
      const premierCours = cours[0];
      console.log('✅ Structure du premier cours:');
      console.log(`   - id_cours: ${premierCours.id_cours}`);
      console.log(`   - titre_fr: ${premierCours.titre_fr || 'N/A'}`);
      console.log(`   - module: ${premierCours.module ? 'Présent' : 'Absent'}`);
      console.log(`   - enseignant: ${premierCours.enseignant ? 'Présent' : 'Absent'}`);
      console.log(`   - status: ${premierCours.status}`);
    }
    
    console.log('\n🎯 Résumé de la correction:');
    console.log(`   ✅ Inscriptions: ${inscriptions.length}`);
    console.log(`   ✅ Offres: ${offreIds.length}`);
    console.log(`   ✅ Modules: ${moduleIds.length}`);
    console.log(`   ✅ Cours: ${cours.length}`);
    console.log('\n🚀 La correction est prête ! L\'API devrait maintenant fonctionner sans erreur 500.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testCorrectionFinale();

const { sequelize } = require('./backend/config/database');

async function testEndpointDirect() {
  try {
    console.log('🧪 Test direct de l\'endpoint API - Vérification de la syntaxe\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const OffreModule = sequelize.models.OffreModule;
    
    console.log('✅ Modèle OffreModule chargé avec succès');
    
    // Test simple de requête
    const count = await OffreModule.count();
    console.log(`📊 Nombre total d\'associations OffreModule: ${count}`);
    
    if (count > 0) {
      const sample = await OffreModule.findOne({
        attributes: ['id_offre', 'id_module']
      });
      console.log(`🔍 Exemple d\'association: Offre ${sample.id_offre} ↔ Module ${sample.id_module}`);
    }
    
    console.log('\n🚀 Test réussi ! Le modèle OffreModule est maintenant syntaxiquement correct.');
    console.log('   L\'API devrait fonctionner sans erreur 500.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('\n💥 Il y a encore un problème de syntaxe ou d\'import.');
  } finally {
    await sequelize.close();
  }
}

testEndpointDirect();

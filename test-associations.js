const { sequelize } = require('./backend/config/database');

async function testAssociations() {
  try {
    console.log('🧪 Test des associations...\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    console.log('✅ Associations configurées');
    
    // Vérifier que les modèles sont bien chargés
    const Offre = sequelize.models.Offre;
    const Module = sequelize.models.Module;
    const Specialite = sequelize.models.Specialite;
    
    console.log('✅ Modèles chargés');
    
    // Vérifier les associations
    if (Offre.associations.specialite) {
      console.log('✅ Association Offre -> Specialite OK');
    } else {
      console.log('❌ Association Offre -> Specialite manquante');
    }
    
    if (Offre.associations.modules) {
      console.log('✅ Association Offre -> Modules (via OffreModule) OK');
    } else {
      console.log('❌ Association Offre -> Modules manquante');
    }
    
    if (Module.associations.offres) {
      console.log('✅ Association Module -> Offres (via OffreModule) OK');
    } else {
      console.log('❌ Association Module -> Offres manquante');
    }
    
    // Test simple de récupération
    console.log('\n🔍 Test de récupération des offres...');
    const offres = await Offre.findAll({
      include: [
        {
          model: Specialite,
          as: 'specialite',
          attributes: ['id_specialite', 'designation_fr']
        }
      ],
      limit: 3
    });
    
    console.log(`✅ Récupéré ${offres.length} offres avec leurs spécialités`);
    
    offres.forEach(offre => {
      console.log(`   - Offre ${offre.id_offre}: ${offre.specialite?.designation_fr || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du test des associations:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le test
testAssociations();

const { sequelize } = require('./backend/config/database');

async function findStagiaireCredentials() {
  try {
    console.log('🔍 Recherche des identifiants stagiaire...\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles
    const Compte = sequelize.models.Compte;
    const Stagiaire = sequelize.models.Stagiaire;
    
    // Trouver un compte stagiaire
    const compte = await Compte.findOne({
      where: { role: 'Stagiaire' },
      attributes: ['id_compte', 'username', 'password'],
      include: [{
        model: Stagiaire,
        as: 'stagiaire',
        attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr']
      }]
    });
    
    if (!compte) {
      console.log('❌ Aucun compte stagiaire trouvé');
      return;
    }
    
    console.log('✅ Compte stagiaire trouvé:');
    console.log(`   ID Compte: ${compte.id_compte}`);
    console.log(`   Username: ${compte.username}`);
    console.log(`   Password: ${compte.password}`);
    console.log(`   ID Stagiaire: ${compte.stagiaire?.id_stagiaire}`);
    console.log(`   Nom: ${compte.stagiaire?.nom_fr} ${compte.stagiaire?.prenom_fr}`);
    
    // Trouver d'autres comptes stagiaire
    const autresComptes = await Compte.findAll({
      where: { role: 'Stagiaire' },
      attributes: ['id_compte', 'username'],
      limit: 5
    });
    
    console.log('\n📋 Autres comptes stagiaire disponibles:');
    autresComptes.forEach((c, index) => {
      console.log(`   ${index + 1}. ${c.username} (ID: ${c.id_compte})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

findStagiaireCredentials();

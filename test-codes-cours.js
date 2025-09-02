const { sequelize } = require('./backend/config/database');

async function testCodesCours() {
  try {
    console.log('🧪 Test des codes de cours existants\n');
    
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer le modèle Cours
    const Cours = sequelize.models.Cours;
    
    // 1. Vérifier tous les codes de cours existants
    const coursExistants = await Cours.findAll({
      attributes: ['id_cours', 'code_cours', 'titre_fr', 'id_module', 'id_enseignant'],
      order: [['code_cours', 'ASC']]
    });
    
    console.log(`📚 Total des cours existants: ${coursExistants.length}`);
    
    if (coursExistants.length > 0) {
      console.log('\n📋 Codes de cours existants:');
      coursExistants.forEach((cours, index) => {
        console.log(`   ${index + 1}. Code: "${cours.code_cours}" - ${cours.titre_fr}`);
        console.log(`      Module ID: ${cours.id_module}, Enseignant ID: ${cours.id_enseignant}`);
      });
      
      // 2. Vérifier les codes qui commencent par "01"
      const codes01 = coursExistants.filter(c => c.code_cours.startsWith('01'));
      if (codes01.length > 0) {
        console.log('\n⚠️ Codes commençant par "01":');
        codes01.forEach(cours => {
          console.log(`   - "${cours.code_cours}" - ${cours.titre_fr}`);
        });
      }
      
      // 3. Suggérer des codes uniques
      console.log('\n💡 Suggestions de codes uniques:');
      console.log('   - SIG-001 (pour Signalisation)');
      console.log('   - VOIR-SIG-001');
      console.log('   - 2025-SIG-001');
      console.log('   - SIG-' + (coursExistants.length + 1).toString().padStart(3, '0'));
    } else {
      console.log('✅ Aucun cours existant - vous pouvez utiliser n\'importe quel code');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testCodesCours();

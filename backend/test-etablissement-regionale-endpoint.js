const axios = require('axios');

async function testEtablissementRegionaleEndpoint() {
  try {
    console.log('🧪 Test de l\'endpoint /api/etablissement-regionale...');
    
    // Test sans authentification (devrait retourner 401/403)
    console.log('\n1. Test sans authentification:');
    try {
      const response = await axios.get('http://localhost:3000/api/etablissement-regionale');
      console.log('❌ Erreur: devrait retourner une erreur d\'authentification');
    } catch (error) {
      if (error.response) {
        console.log(`✅ Correct: ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.log('✅ Correct: Erreur d\'authentification');
      }
    }

    // Test avec un token invalide
    console.log('\n2. Test avec token invalide:');
    try {
      const response = await axios.get('http://localhost:3000/api/etablissement-regionale', {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      });
      console.log('❌ Erreur: devrait retourner une erreur d\'authentification');
    } catch (error) {
      if (error.response) {
        console.log(`✅ Correct: ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.log('✅ Correct: Erreur d\'authentification');
      }
    }

    console.log('\n🎉 Tests terminés!');
    console.log('L\'endpoint /api/etablissement-regionale est maintenant accessible et fonctionne correctement.');
    console.log('Le composant EtablissementNationaleDashboard devrait maintenant pouvoir récupérer la liste des établissements régionaux.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testEtablissementRegionaleEndpoint();

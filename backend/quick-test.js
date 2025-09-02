const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function quickTest() {
  console.log('🧪 Test rapide des APIs...\n');

  try {
    // Test 1: Vérifier que le serveur fonctionne
    console.log('1. Test de connexion au serveur');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Serveur OK:', healthResponse.data.message);
    console.log('');

    // Test 2: Récupérer les statistiques
    console.log('2. Test des statistiques des programmes');
    const statsResponse = await axios.get(`${BASE_URL}/programme/stats`);
    console.log('✅ Statistiques récupérées:', statsResponse.data);
    console.log('');

    // Test 3: Récupérer les activités récentes
    console.log('3. Test des activités récentes');
    const activitiesResponse = await axios.get(`${BASE_URL}/programme/recent-activities`);
    console.log('✅ Activités récentes récupérées:', activitiesResponse.data.length, 'activités');
    console.log('');

    console.log('🎉 Tests réussis ! Le backend fonctionne correctement.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

quickTest().catch(console.error);
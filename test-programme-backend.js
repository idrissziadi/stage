const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testProgrammeAPIs() {
  console.log('🧪 Test des APIs Programme...\n');

  try {
    // Test 1: Vérifier que le serveur fonctionne
    console.log('1. Test de connexion au serveur');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Serveur OK:', healthResponse.data.message);
    console.log('');

    // Test 2: Login pour obtenir un token
    console.log('2. Test de connexion enseignant');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'ens1',
      password: 'password123'
    });
    
    if (loginResponse.data.token) {
      const token = loginResponse.data.token;
      console.log('✅ Connexion réussie, token obtenu');
      
      // Test 3: Récupérer les programmes pour l'enseignant
      console.log('');
      console.log('3. Test récupération programmes enseignant (ID: 2)');
      const programmesResponse = await axios.get(`${BASE_URL}/programme/enseignant/2`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Programmes récupérés:', programmesResponse.data.length, 'programmes');
      console.log('Premier programme:', programmesResponse.data[0] || 'Aucun programme');
      
    } else {
      console.log('❌ Échec de connexion');
    }

    // Test 4: Récupérer les statistiques (sans auth nécessaire)
    console.log('');
    console.log('4. Test des statistiques');
    const statsResponse = await axios.get(`${BASE_URL}/programme/stats`);
    console.log('✅ Statistiques récupérées:', statsResponse.data);

    console.log('');
    console.log('🎉 Tests terminés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test:');
    console.error('URL:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    if (error.response?.data?.error) {
      console.error('Détails:', error.response.data.error);
    }
  }
}

testProgrammeAPIs().catch(console.error);

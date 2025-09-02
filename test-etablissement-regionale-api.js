const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3001';
const TOKEN = 'VOTRE_TOKEN_ICI'; // Remplacez par un token valide

// Headers avec authentification
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function testEtablissementRegionaleAPI() {
  console.log('🧪 Test de l\'API Établissement Régional\n');

  try {
    // Test 1: API des cours
    console.log('1️⃣ Test: API des cours');
    console.log('GET /cours');
    
    const coursesResponse = await axios.get(`${BASE_URL}/cours`, { headers });
    
    console.log('✅ Succès!');
    console.log('📊 Cours trouvés:', coursesResponse.data?.length || 0);
    console.log('');

    // Test 2: API des modules
    console.log('2️⃣ Test: API des modules');
    console.log('GET /module');
    
    const modulesResponse = await axios.get(`${BASE_URL}/module`, { headers });
    
    console.log('✅ Succès!');
    console.log('📊 Modules trouvés:', modulesResponse.data?.length || 0);
    console.log('');

    // Test 3: API des enseignants (avec ID 1)
    console.log('3️⃣ Test: API des enseignants');
    console.log('GET /etablissement/1/enseignants');
    
    const enseignantsResponse = await axios.get(`${BASE_URL}/etablissement/1/enseignants?limit=10`, { headers });
    
    console.log('✅ Succès!');
    console.log('📊 Enseignants trouvés:', enseignantsResponse.data?.length || 0);
    console.log('');

    // Test 4: API des enseignants (avec ID 0 - doit échouer)
    console.log('4️⃣ Test: API des enseignants avec ID 0 (doit échouer)');
    console.log('GET /etablissement/0/enseignants');
    
    try {
      const enseignantsResponse0 = await axios.get(`${BASE_URL}/etablissement/0/enseignants?limit=10`, { headers });
      console.log('⚠️ Inattendu: API a réussi avec ID 0');
      console.log('📊 Enseignants trouvés:', enseignantsResponse0.data?.length || 0);
    } catch (error) {
      console.log('✅ Attendu: API a échoué avec ID 0');
      console.log('📊 Status:', error.response?.status);
      console.log('📊 Message:', error.response?.data?.message || 'Pas de message');
    }
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Solution: Vérifiez que votre token d\'authentification est valide');
    } else if (error.response?.status === 403) {
      console.log('\n💡 Solution: Vérifiez les permissions de l\'utilisateur');
    } else if (error.response?.status === 404) {
      console.log('\n💡 Solution: Vérifiez que la route existe');
    }
  }
}

// Test avec un token spécifique
async function testWithSpecificToken(token) {
  console.log(`\n🔍 Test avec le token: ${token.substring(0, 20)}...`);
  
  const specificHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(`${BASE_URL}/cours`, { headers: specificHeaders });
    console.log('✅ API accessible avec ce token');
    console.log('📊 Cours trouvés:', response.data?.length || 0);
  } catch (error) {
    console.error('❌ Erreur avec ce token:', error.response?.status, error.response?.data?.message);
  }
}

// Exécution des tests
if (require.main === module) {
  console.log('🚀 Démarrage des tests de l\'API Établissement Régional...\n');
  
  // Test principal
  testEtablissementRegionaleAPI();
  
  // Test avec un token spécifique (décommentez si nécessaire)
  // testWithSpecificToken('VOTRE_TOKEN_SPECIFIQUE');
}

module.exports = { testEtablissementRegionaleAPI, testWithSpecificToken };

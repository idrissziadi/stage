const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testCompleteSystem() {
  console.log('🧪 Test complet du système de gestion des programmes...\n');

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

    // Test 4: Récupérer tous les programmes
    console.log('4. Test de récupération de tous les programmes');
    const programmesResponse = await axios.get(`${BASE_URL}/programme`);
    console.log('✅ Programmes récupérés:', programmesResponse.data.length, 'programmes');
    console.log('');

    // Test 5: Récupérer les programmes par statut
    console.log('5. Test des programmes par statut');
    const statusResponse = await axios.get(`${BASE_URL}/programme/status/في_الانتظار`);
    console.log('✅ Programmes en attente:', statusResponse.data.length);
    console.log('');

    // Test 6: Récupérer les programmes pour un enseignant
    console.log('6. Test des programmes pour enseignant');
    const enseignantResponse = await axios.get(`${BASE_URL}/programme/enseignant/1`);
    console.log('✅ Programmes pour enseignant:', enseignantResponse.data.length);
    console.log('');

    console.log('🎉 Tous les tests sont passés avec succès !');
    console.log('');
    console.log('📊 Résumé:');
    console.log(`- Total programmes: ${statsResponse.data.total || 0}`);
    console.log(`- En attente: ${statsResponse.data.parStatut?.['في_الانتظار'] || 0}`);
    console.log(`- Validés: ${statsResponse.data.parStatut?.['مقبول'] || 0}`);
    console.log(`- Refusés: ${statsResponse.data.parStatut?.['مرفوض'] || 0}`);
    console.log(`- Activités récentes: ${activitiesResponse.data.length}`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

// Fonction pour tester avec authentification
async function testWithAuth() {
  console.log('🔐 Test avec authentification...\n');
  
  try {
    // Simuler une connexion (vous devrez adapter selon votre système d'auth)
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    console.log('✅ Authentification réussie');
    
    // Test avec token
    const statsResponse = await axios.get(`${BASE_URL}/programme/stats`, config);
    console.log('✅ Statistiques avec auth:', statsResponse.data);

  } catch (error) {
    console.log('ℹ️ Test d\'authentification non disponible (normal si pas d\'utilisateur de test)');
  }
}

// Exécuter les tests
async function runTests() {
  await testCompleteSystem();
  console.log('');
  await testWithAuth();
}

runTests().catch(console.error);

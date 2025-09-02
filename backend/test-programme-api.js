const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testProgrammeAPI() {
  console.log('🧪 Test des APIs Programme...\n');

  try {
    // Test 1: Récupérer tous les programmes
    console.log('1. Test GET /programme');
    const response1 = await axios.get(`${BASE_URL}/programme`);
    console.log('✅ Succès:', response1.data.length, 'programmes trouvés');
    console.log('Premier programme:', response1.data[0] ? {
      id: response1.data[0].id_programme,
      code: response1.data[0].code_programme,
      titre: response1.data[0].titre_fr,
      status: response1.data[0].status
    } : 'Aucun programme');
    console.log('');

    // Test 2: Récupérer les statistiques
    console.log('2. Test GET /programme/stats');
    const response2 = await axios.get(`${BASE_URL}/programme/stats`);
    console.log('✅ Succès:', response2.data);
    console.log('');

    // Test 3: Récupérer les programmes par statut
    console.log('3. Test GET /programme/status/في_الانتظار');
    const response3 = await axios.get(`${BASE_URL}/programme/status/في_الانتظار`);
    console.log('✅ Succès:', response3.data.length, 'programmes en attente');
    console.log('');

    // Test 4: Récupérer les programmes d'un établissement régional
    console.log('4. Test GET /programme/etablissement/1');
    const response4 = await axios.get(`${BASE_URL}/programme/etablissement/1`);
    console.log('✅ Succès:', response4.data.length, 'programmes pour l\'établissement 1');
    console.log('');

    // Test 5: Récupérer les programmes d'un enseignant
    console.log('5. Test GET /programme/enseignant/1');
    const response5 = await axios.get(`${BASE_URL}/programme/enseignant/1`);
    console.log('✅ Succès:', response5.data.length, 'programmes pour l\'enseignant 1');
    console.log('');

    console.log('🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : error.message);
  }
}

// Exécuter les tests
testProgrammeAPI();

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3001';
const TOKEN = 'VOTRE_TOKEN_ICI'; // Remplacez par un token valide

// Headers avec authentification
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function testModulesAPI() {
  console.log('🧪 Test de l\'API des modules pour enseignant\n');

  try {
    // Test 1: API des modules assignés (nouvelle route)
    console.log('1️⃣ Test: API des modules assignés (ens-module)');
    console.log('GET /ens-module/enseignant/1/modules');
    
    const response1 = await axios.get(`${BASE_URL}/ens-module/enseignant/1/modules`, { headers });
    
    console.log('✅ Succès!');
    console.log('📊 Structure de la réponse:');
    console.log('   - Type:', typeof response1.data);
    console.log('   - Clés:', Object.keys(response1.data));
    
    if (response1.data.modules_by_year) {
      console.log('   - Années scolaires:', Object.keys(response1.data.modules_by_year));
      Object.entries(response1.data.modules_by_year).forEach(([year, modules]) => {
        console.log(`     • ${year}: ${modules.length} module(s)`);
      });
    }
    
    console.log('');

    // Test 2: API des modules de base (ancienne route)
    console.log('2️⃣ Test: API des modules de base (module)');
    console.log('GET /module/enseignant/1');
    
    const response2 = await axios.get(`${BASE_URL}/module/enseignant/1`, { headers });
    
    console.log('✅ Succès!');
    console.log('📊 Structure de la réponse:');
    console.log('   - Type:', typeof response2.data);
    console.log('   - Est un tableau:', Array.isArray(response2.data));
    if (Array.isArray(response2.data)) {
      console.log('   - Nombre de modules:', response2.data.length);
      if (response2.data.length > 0) {
        console.log('   - Premier module:', response2.data[0]);
      }
    }
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Solution: Vérifiez que votre token d\'authentification est valide');
    } else if (error.response?.status === 404) {
      console.log('\n💡 Solution: Vérifiez que l\'enseignant avec l\'ID 1 existe');
    }
  }
}

// Exécution des tests
if (require.main === module) {
  console.log('🚀 Démarrage des tests de l\'API des modules...\n');
  testModulesAPI();
}

module.exports = { testModulesAPI };

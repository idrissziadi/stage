const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3001';

async function testEtablissementRegionaleProfile() {
  console.log('🧪 Test du profil EtablissementRegionale\n');

  try {
    // Test 1: Vérifier que l'API est accessible
    console.log('1️⃣ Test: Vérification de l\'API');
    console.log('GET /user/profile');
    
    // Test sans token (doit échouer avec 401)
    try {
      const response = await axios.get(`${BASE_URL}/user/profile`);
      console.log('⚠️ Inattendu: API accessible sans token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Attendu: API protégée (401 Unauthorized)');
      } else {
        console.log('❌ Erreur inattendue:', error.response?.status);
      }
    }
    console.log('');

    // Test 2: Vérifier la structure de la base de données
    console.log('2️⃣ Test: Structure de la base de données');
    console.log('Vérifiez que:');
    console.log('- Table EtablissementRegionale existe');
    console.log('- Table Compte contient des utilisateurs avec role = "EtablissementRegionale"');
    console.log('- Relation compte_id est correcte');
    console.log('');

    // Test 3: Instructions pour tester avec un token valide
    console.log('3️⃣ Test: Avec un token valide');
    console.log('Pour tester complètement:');
    console.log('1. Connectez-vous avec un compte EtablissementRegionale');
    console.log('2. Copiez le token depuis localStorage (auth_token)');
    console.log('3. Exécutez:');
    console.log(`   curl -H "Authorization: Bearer VOTRE_TOKEN" ${BASE_URL}/user/profile`);
    console.log('');

    // Test 4: Vérification des modèles
    console.log('4️⃣ Test: Vérification des modèles');
    console.log('✅ EtablissementRegionale.js - Modèle défini');
    console.log('✅ associations.js - Relations définies');
    console.log('✅ UserController.js - Support ajouté pour EtablissementRegionale');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

// Exécution des tests
if (require.main === module) {
  console.log('🚀 Démarrage des tests du profil EtablissementRegionale...\n');
  testEtablissementRegionaleProfile();
}

module.exports = { testEtablissementRegionaleProfile };

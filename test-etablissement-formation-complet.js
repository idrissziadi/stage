// test-etablissement-formation-complet.js
// Script de test pour la création d'établissement de formation avec stagiaire et inscription automatiques

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/auth/signup/etablissement-formation`;

async function testEtablissementFormationCreation() {
  console.log('🧪 Test de création d\'établissement de formation avec stagiaire et inscription automatiques');
  console.log('=' .repeat(80));

  try {
    // Test 1: Création avec données minimales
    console.log('\n📝 Test 1: Création avec données minimales');
    const testData1 = {
      username: 'etab_test_' + Date.now(),
      password: 'password123',
      nom_fr: 'Institut de Formation Test',
      nom_ar: 'معهد التكوين التجريبي'
    };

    console.log('Données envoyées:', JSON.stringify(testData1, null, 2));
    
    const response1 = await axios.post(API_URL, testData1);
    console.log('✅ Succès! Réponse reçue:');
    console.log('Status:', response1.status);
    console.log('Établissement créé:', response1.data.etablissement);
    console.log('Stagiaire créé:', response1.data.stagiaire);
    console.log('Offre:', response1.data.offre);
    console.log('Inscription:', response1.data.inscription);

    // Test 2: Création avec données complètes
    console.log('\n📝 Test 2: Création avec données complètes');
    const testData2 = {
      username: 'etab_complet_' + Date.now(),
      password: 'password456',
      nom_fr: 'Centre de Formation Avancé',
      nom_ar: 'مركز التكوين المتقدم',
      adresse_fr: '123 Rue de la Formation, Ville Test',
      adresse_ar: '١٢٣ شارع التكوين، مدينة التجربة',
      email: 'contact@formation-test.com',
      telephone: '+212-5-1234-5678',
      stagiaire_nom_fr: 'Dupont',
      stagiaire_nom_ar: 'دوبون',
      stagiaire_prenom_fr: 'Jean',
      stagiaire_prenom_ar: 'جان',
      stagiaire_date_naissance: '1995-06-15',
      stagiaire_email: 'jean.dupont@email.com',
      stagiaire_telephone: '+212-6-1234-5678'
    };

    console.log('Données envoyées:', JSON.stringify(testData2, null, 2));
    
    const response2 = await axios.post(API_URL, testData2);
    console.log('✅ Succès! Réponse reçue:');
    console.log('Status:', response2.status);
    console.log('Établissement créé:', response2.data.etablissement);
    console.log('Stagiaire créé:', response2.data.stagiaire);
    console.log('Offre:', response2.data.offre);
    console.log('Inscription:', response2.data.inscription);

    // Test 3: Test de validation - nom d'utilisateur manquant
    console.log('\n📝 Test 3: Test de validation - nom d\'utilisateur manquant');
    const testData3 = {
      password: 'password789',
      nom_fr: 'Institut Invalide',
      nom_ar: 'معهد غير صالح'
    };

    try {
      const response3 = await axios.post(API_URL, testData3);
      console.log('❌ Erreur: La validation aurait dû échouer');
    } catch (error) {
      console.log('✅ Validation fonctionne correctement:');
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
    }

    // Test 4: Test de validation - nom d'utilisateur déjà pris
    console.log('\n📝 Test 4: Test de validation - nom d\'utilisateur déjà pris');
    const testData4 = {
      username: testData1.username, // Utiliser le même username que le premier test
      password: 'password999',
      nom_fr: 'Institut Dupliqué',
      nom_ar: 'معهد مكرر'
    };

    try {
      const response4 = await axios.post(API_URL, testData4);
      console.log('❌ Erreur: La validation aurait dû échouer');
    } catch (error) {
      console.log('✅ Validation fonctionne correctement:');
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
    }

    console.log('\n🎉 Tous les tests sont terminés avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Données d\'erreur:', error.response.data);
    }
  }
}

// Fonction pour vérifier que le serveur est en cours d'exécution
async function checkServerStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Serveur accessible:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Serveur inaccessible:', error.message);
    console.log('Assurez-vous que le serveur backend est en cours d\'exécution sur le port 3000');
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage des tests d\'établissement de formation');
  
  const serverOk = await checkServerStatus();
  if (!serverOk) {
    console.log('❌ Impossible de continuer sans serveur');
    process.exit(1);
  }

  await testEtablissementFormationCreation();
  
  console.log('\n🏁 Tests terminés');
}

// Exécuter les tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testEtablissementFormationCreation };

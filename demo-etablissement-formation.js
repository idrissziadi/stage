// demo-etablissement-formation.js
// Script de démonstration pour la création d'établissement de formation

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/auth/signup/etablissement-formation`;

console.log('🎓 Démonstration - Création d\'Établissement de Formation Complet');
console.log('=' .repeat(70));

// Exemple 1: Création minimale
async function demoCreationMinimale() {
  console.log('\n📝 Exemple 1: Création avec données minimales');
  
  const data = {
    username: 'demo_min_' + Date.now(),
    password: 'demo123',
    nom_fr: 'Institut de Formation Démo',
    nom_ar: 'معهد التكوين التجريبي'
  };

  try {
    const response = await axios.post(API_URL, data);
    console.log('✅ Succès!');
    console.log('Établissement:', response.data.etablissement.nom_fr);
    console.log('Code:', response.data.etablissement.code);
    console.log('Stagiaire:', response.data.stagiaire.nom_fr, response.data.stagiaire.prenom_fr);
    console.log('Inscription:', response.data.inscription ? 'Créée' : 'Non créée');
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Exemple 2: Création complète
async function demoCreationComplete() {
  console.log('\n📝 Exemple 2: Création avec données complètes');
  
  const data = {
    username: 'demo_complet_' + Date.now(),
    password: 'demo456',
    nom_fr: 'Centre de Formation Avancé',
    nom_ar: 'مركز التكوين المتقدم',
    adresse_fr: '456 Avenue de l\'Éducation, Ville Démo',
    adresse_ar: '٤٥٦ شارع التعليم، مدينة التجربة',
    email: 'contact@demo-formation.com',
    telephone: '+212-5-9876-5432',
    stagiaire_nom_fr: 'Martin',
    stagiaire_nom_ar: 'مارتن',
    stagiaire_prenom_fr: 'Sophie',
    stagiaire_prenom_ar: 'صوفي',
    stagiaire_date_naissance: '1998-03-20',
    stagiaire_email: 'sophie.martin@email.com',
    stagiaire_telephone: '+212-6-9876-5432'
  };

  try {
    const response = await axios.post(API_URL, data);
    console.log('✅ Succès!');
    console.log('Établissement:', response.data.etablissement.nom_fr);
    console.log('Adresse:', response.data.etablissement.adresse_fr);
    console.log('Email:', response.data.etablissement.email);
    console.log('Stagiaire:', response.data.stagiaire.nom_fr, response.data.stagiaire.prenom_fr);
    console.log('Email stagiaire:', response.data.stagiaire.email);
    console.log('Inscription:', response.data.inscription ? 'Créée' : 'Non créée');
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Exemple 3: Test de validation
async function demoValidation() {
  console.log('\n📝 Exemple 3: Test de validation des erreurs');
  
  // Test sans username
  console.log('Test sans username:');
  try {
    const response = await axios.post(API_URL, {
      password: 'test123',
      nom_fr: 'Test Invalide',
      nom_ar: 'اختبار غير صالح'
    });
    console.log('❌ Erreur: La validation aurait dû échouer');
  } catch (error) {
    console.log('✅ Validation correcte:', error.response.data.message);
  }

  // Test avec nom d'utilisateur déjà pris
  console.log('\nTest avec nom d\'utilisateur déjà pris:');
  try {
    const response = await axios.post(API_URL, {
      username: 'demo_min_' + Date.now(), // Utiliser un username qui n'existe pas
      password: 'test456',
      nom_fr: 'Test Dupliqué',
      nom_ar: 'اختبار مكرر'
    });
    console.log('✅ Création réussie avec nouveau username');
  } catch (error) {
    console.log('❌ Erreur:', error.response.data.message);
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage de la démonstration...\n');
  
  // Vérifier que le serveur est accessible
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Serveur accessible\n');
  } catch (error) {
    console.error('❌ Serveur inaccessible. Assurez-vous qu\'il est en cours d\'exécution sur le port 3000');
    return;
  }

  // Exécuter les démonstrations
  await demoCreationMinimale();
  await demoCreationComplete();
  await demoValidation();

  console.log('\n🎉 Démonstration terminée!');
  console.log('\n💡 Pour plus d\'informations, consultez le guide: GUIDE_ETABLISSEMENT_FORMATION_COMPLET.md');
}

// Exécuter la démonstration
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { demoCreationMinimale, demoCreationComplete, demoValidation };

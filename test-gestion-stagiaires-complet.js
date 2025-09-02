// test-gestion-stagiaires-complet.js
// Script de test complet pour la gestion des stagiaires et inscriptions

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Configuration pour les tests
let authToken = null;
let etablissementId = null;
let stagiaireIds = [];
let offreIds = [];

// Fonction pour se connecter en tant qu'établissement de formation
async function loginEtablissementFormation() {
  console.log('🔐 Connexion en tant qu\'établissement de formation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'etab_test', // Remplacer par un username existant
      password: 'password123'
    });
    
    authToken = response.data.token;
    console.log('✅ Connexion réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 1: Créer un stagiaire sans compte utilisateur
async function testCreationStagiaireSansCompte() {
  console.log('\n📝 Test 1: Création d\'un stagiaire sans compte utilisateur');
  
  const stagiaireData = {
    nom_fr: 'Dupont',
    prenom_fr: 'Marie',
    nom_ar: 'دوبون',
    prenom_ar: 'ماري',
    email: 'marie.dupont@email.com',
    telephone: '+212-6-1234-5678',
    date_naissance: '1990-05-15'
  };

  try {
    const response = await axios.post(`${BASE_URL}/etablissement/stagiaires`, stagiaireData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Stagiaire créé avec succès:');
    console.log('ID:', response.data.stagiaire.id_stagiaire);
    console.log('Nom:', response.data.stagiaire.nom_fr, response.data.stagiaire.prenom_fr);
    console.log('Compte:', response.data.compte ? 'Créé' : 'Non créé');
    console.log('Inscription:', response.data.inscription ? 'Créée' : 'Non créée');
    
    stagiaireIds.push(response.data.stagiaire.id_stagiaire);
    return response.data.stagiaire;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 2: Créer un stagiaire avec compte utilisateur
async function testCreationStagiaireAvecCompte() {
  console.log('\n📝 Test 2: Création d\'un stagiaire avec compte utilisateur');
  
  const stagiaireData = {
    nom_fr: 'Martin',
    prenom_fr: 'Pierre',
    nom_ar: 'مارتن',
    prenom_ar: 'بيير',
    email: 'pierre.martin@email.com',
    telephone: '+212-6-9876-5432',
    date_naissance: '1988-12-03',
    username: 'pierre.martin',
    password: 'password123'
  };

  try {
    const response = await axios.post(`${BASE_URL}/etablissement/stagiaires`, stagiaireData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Stagiaire créé avec succès:');
    console.log('ID:', response.data.stagiaire.id_stagiaire);
    console.log('Nom:', response.data.stagiaire.nom_fr, response.data.stagiaire.prenom_fr);
    console.log('Compte:', response.data.compte ? 'Créé' : 'Non créé');
    if (response.data.compte) {
      console.log('Username:', response.data.compte.username);
    }
    
    stagiaireIds.push(response.data.stagiaire.id_stagiaire);
    return response.data.stagiaire;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 3: Créer un stagiaire avec inscription automatique à une offre
async function testCreationStagiaireAvecInscription() {
  console.log('\n📝 Test 3: Création d\'un stagiaire avec inscription automatique');
  
  // D'abord, récupérer les offres disponibles
  try {
    const offresResponse = await axios.get(`${BASE_URL}/etablissement/offres`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (offresResponse.data.offres && offresResponse.data.offres.length > 0) {
      const premiereOffre = offresResponse.data.offres[0];
      offreIds.push(premiereOffre.id_offre);
      
      const stagiaireData = {
        nom_fr: 'Bernard',
        prenom_fr: 'Sophie',
        nom_ar: 'برنار',
        prenom_ar: 'صوفي',
        email: 'sophie.bernard@email.com',
        telephone: '+212-6-5555-1234',
        date_naissance: '1992-08-20',
        id_offre: premiereOffre.id_offre
      };

      const response = await axios.post(`${BASE_URL}/etablissement/stagiaires`, stagiaireData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('✅ Stagiaire créé avec inscription automatique:');
      console.log('ID:', response.data.stagiaire.id_stagiaire);
      console.log('Nom:', response.data.stagiaire.nom_fr, response.data.stagiaire.prenom_fr);
      console.log('Inscription:', response.data.inscription ? 'Créée' : 'Non créée');
      if (response.data.inscription) {
        console.log('Statut inscription:', response.data.inscription.statut);
      }
      
      stagiaireIds.push(response.data.stagiaire.id_stagiaire);
      return response.data.stagiaire;
    } else {
      console.log('⚠️ Aucune offre disponible pour tester l\'inscription automatique');
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 4: Inscrire un stagiaire existant à une offre
async function testInscriptionStagiaireExistant() {
  console.log('\n📝 Test 4: Inscription d\'un stagiaire existant à une offre');
  
  if (stagiaireIds.length === 0 || offreIds.length === 0) {
    console.log('⚠️ Impossible de tester: pas de stagiaire ou d\'offre disponible');
    return null;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/etablissement/stagiaires/${stagiaireIds[0]}/inscrire`,
      { id_offre: offreIds[0] },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    console.log('✅ Stagiaire inscrit avec succès:');
    console.log('ID inscription:', response.data.inscription.id_inscription);
    console.log('Statut:', response.data.inscription.statut);
    console.log('Date inscription:', response.data.inscription.date_inscription);
    
    return response.data.inscription;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 5: Inscription en masse de plusieurs stagiaires
async function testInscriptionEnMasse() {
  console.log('\n📝 Test 5: Inscription en masse de plusieurs stagiaires');
  
  if (stagiaireIds.length < 2 || offreIds.length === 0) {
    console.log('⚠️ Impossible de tester: pas assez de stagiaires ou d\'offres disponibles');
    return null;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/etablissement/stagiaires/inscription-masse`,
      {
        id_offre: offreIds[0],
        stagiaire_ids: stagiaireIds.slice(1) // Utiliser les stagiaires 2 et 3
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    console.log('✅ Inscription en masse réussie:');
    console.log('Inscriptions créées:', response.data.inscriptions_crees);
    console.log('Inscriptions existantes:', response.data.inscriptions_existantes);
    console.log('Total stagiaires:', response.data.total_stagiaires);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 6: Créer un compte pour un stagiaire existant
async function testCreationComptePourStagiaire() {
  console.log('\n📝 Test 6: Création d\'un compte pour un stagiaire existant');
  
  if (stagiaireIds.length === 0) {
    console.log('⚠️ Impossible de tester: pas de stagiaire disponible');
    return null;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/etablissement/stagiaires/${stagiaireIds[0]}/create-account`,
      {
        username: 'stagiaire_' + Date.now(),
        password: 'password123'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    console.log('✅ Compte créé avec succès:');
    console.log('Username:', response.data.stagiaire.Compte.username);
    console.log('Role:', response.data.stagiaire.Compte.role);
    
    return response.data.stagiaire;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 7: Lister tous les stagiaires de l'établissement
async function testListeStagiaires() {
  console.log('\n📝 Test 7: Liste des stagiaires de l\'établissement');
  
  try {
    const response = await axios.get(`${BASE_URL}/etablissement/stagiaires`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Liste des stagiaires récupérée:');
    console.log('Total stagiaires:', response.data.total);
    console.log('Stagiaires:', response.data.stagiaires.length);
    
    response.data.stagiaires.forEach((stagiaire, index) => {
      console.log(`${index + 1}. ${stagiaire.nom_fr} ${stagiaire.prenom_fr} (ID: ${stagiaire.id_stagiaire})`);
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 8: Lister les inscriptions de l'établissement
async function testListeInscriptions() {
  console.log('\n📝 Test 8: Liste des inscriptions de l\'établissement');
  
  try {
    const response = await axios.get(`${BASE_URL}/etablissement/inscriptions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Liste des inscriptions récupérée:');
    console.log('Total inscriptions:', response.data.total);
    console.log('Inscriptions:', response.data.inscriptions.length);
    
    response.data.inscriptions.forEach((inscription, index) => {
      console.log(`${index + 1}. Stagiaire ${inscription.stagiaire.nom_fr} - Offre ${inscription.offre.id_offre} - Statut: ${inscription.statut}`);
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data?.message || error.message);
    return null;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage des tests de gestion des stagiaires');
  console.log('=' .repeat(60));
  
  // Vérifier que le serveur est accessible
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Serveur accessible\n');
  } catch (error) {
    console.error('❌ Serveur inaccessible. Assurez-vous qu\'il est en cours d\'exécution sur le port 3000');
    return;
  }

  // Se connecter
  const loginOk = await loginEtablissementFormation();
  if (!loginOk) {
    console.log('❌ Impossible de continuer sans connexion');
    return;
  }

  // Exécuter tous les tests
  await testCreationStagiaireSansCompte();
  await testCreationStagiaireAvecCompte();
  await testCreationStagiaireAvecInscription();
  await testInscriptionStagiaireExistant();
  await testInscriptionEnMasse();
  await testCreationComptePourStagiaire();
  await testListeStagiaires();
  await testListeInscriptions();

  console.log('\n🎉 Tous les tests sont terminés!');
  console.log('\n📊 Résumé:');
  console.log(`- Stagiaires créés: ${stagiaireIds.length}`);
  console.log(`- Offres utilisées: ${offreIds.length}`);
  console.log(`- Tests exécutés: 8`);
}

// Exécuter les tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testCreationStagiaireSansCompte,
  testCreationStagiaireAvecCompte,
  testCreationStagiaireAvecInscription,
  testInscriptionStagiaireExistant,
  testInscriptionEnMasse,
  testCreationComptePourStagiaire,
  testListeStagiaires,
  testListeInscriptions
};

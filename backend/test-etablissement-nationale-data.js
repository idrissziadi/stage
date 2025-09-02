const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Données de test pour l'établissement national
const etabNationaleData = {
  code: 'ETAB_NAT_001',
  nom_fr: 'Ministère de la Formation et de l\'Enseignement Professionnel',
  nom_ar: 'وزارة التكوين والتعليم المهني',
  adresse_fr: '123 Rue de la Formation, Alger 16000, Algérie',
  adresse_ar: '١٢٣ شارع التكوين، الجزائر العاصمة ١٦٠٠٠، الجزائر',
  email: 'contact@mfep.gov.dz',
  telephone: '+213 21 123456',
  compte_id: 1 // Assurez-vous que ce compte existe
};

async function createEtablissementNationale() {
  try {
    console.log('🚀 Création de l\'établissement national...');
    
    // Créer l'établissement national
    const response = await axios.post(`${BASE_URL}/etablissement/nationale`, etabNationaleData);
    
    console.log('✅ Établissement national créé avec succès:', response.data);
    
    // Vérifier le profil
    console.log('🔍 Vérification du profil...');
    const profileResponse = await axios.get(`${BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${response.data.token || 'test-token'}`
      }
    });
    
    console.log('📋 Profil récupéré:', profileResponse.data);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.response?.data || error.message);
  }
}

// Exécuter le script
createEtablissementNationale();

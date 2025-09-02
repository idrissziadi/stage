const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testStagiaireAPI() {
  try {
    console.log('🧪 Test de l\'API Stagiaire avec authentification\n');
    
    // 1. Connexion pour obtenir un token
    console.log('🔐 Connexion...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'idrissziadi', // Compte stagiaire valide trouvé
      password: 'password123'  // Essayons ce mot de passe
    });
    
    const { token } = loginResponse.data;
    console.log('✅ Token obtenu:', token ? 'OUI' : 'NON');
    
    if (!token) {
      console.log('❌ Échec de la connexion');
      return;
    }
    
    // 2. Récupérer le profil utilisateur
    console.log('\n👤 Récupération du profil...');
    const profileResponse = await axios.get(`${API_BASE}/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const userProfile = profileResponse.data;
    console.log('✅ Profil récupéré:', userProfile);
    
    // 3. Tester l'endpoint des cours du stagiaire
    if (userProfile.id_stagiaire) {
      console.log(`\n📚 Test de l'endpoint /cours/stagiaire/${userProfile.id_stagiaire}...`);
      
      const coursResponse = await axios.get(`${API_BASE}/cours/stagiaire/${userProfile.id_stagiaire}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const cours = coursResponse.data;
      console.log('✅ Cours récupérés:', cours.length);
      console.log('📋 Données des cours:', cours);
      
    } else {
      console.log('⚠️ Pas d\'ID stagiaire dans le profil');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔐 Erreur d\'authentification - Vérifiez les identifiants');
    } else if (error.response?.status === 500) {
      console.log('💥 Erreur serveur - Vérifiez les logs du backend');
    }
  }
}

testStagiaireAPI();

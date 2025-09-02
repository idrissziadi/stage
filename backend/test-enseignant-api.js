const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEnseignantAPI() {
  console.log('🧪 Test API enseignant programmes...\n');

  try {
    // Test 1: Vérifier que le serveur fonctionne
    console.log('1. Test de connexion au serveur');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Serveur OK:', healthResponse.data.message);

    // Test 2: Login pour obtenir un token enseignant
    console.log('\n2. Connexion enseignant');
    let token;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        username: 'ens1',
        password: 'password123'
      });
      
      if (loginResponse.data.token) {
        token = loginResponse.data.token;
        console.log('✅ Connexion réussie, rôle:', loginResponse.data.role);
      } else {
        console.log('❌ Échec de connexion');
        return;
      }
    } catch (loginError) {
      console.log('⚠️ Erreur de connexion avec ens1, essayons avec d\'autres comptes...');
      
      // Essayer avec d'autres comptes enseignant possibles
      const comptes = ['enseignant1', 'enseignant', 'prof1'];
      for (const compte of comptes) {
        try {
          const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: compte,
            password: 'password123'
          });
          
          if (loginResponse.data.token && loginResponse.data.role === 'Enseignant') {
            token = loginResponse.data.token;
            console.log(`✅ Connexion réussie avec ${compte}`);
            break;
          }
        } catch (err) {
          console.log(`❌ Échec avec ${compte}`);
        }
      }
      
      if (!token) {
        console.log('❌ Impossible de se connecter avec un compte enseignant');
        return;
      }
    }

    // Test 3: Récupérer le profil utilisateur pour obtenir l'ID
    console.log('\n3. Récupération du profil enseignant');
    const profileResponse = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const profile = profileResponse.data;
    console.log('✅ Profil récupéré:', {
      id_enseignant: profile.id_enseignant,
      nom: profile.nom_fr,
      role: profile.role
    });

    if (!profile.id_enseignant) {
      console.log('❌ ID enseignant manquant dans le profil');
      return;
    }

    // Test 4: Récupérer les programmes de l'enseignant
    console.log('\n4. Test récupération programmes enseignant');
    const programmesResponse = await axios.get(`${BASE_URL}/programme/enseignant/${profile.id_enseignant}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const programmes = programmesResponse.data;
    console.log(`✅ Programmes récupérés: ${programmes.length} programmes`);
    
    if (programmes.length > 0) {
      console.log('\nDétails des programmes:');
      programmes.forEach((p, index) => {
        console.log(`${index + 1}. ${p.code_programme}: ${p.titre_fr}`);
        console.log(`   Status: ${p.status}`);
        console.log(`   Module: ${p.module?.designation_fr || 'N/A'}`);
        console.log(`   Établissement: ${p.etablissementRegionale?.nom_fr || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ Aucun programme trouvé pour cet enseignant');
      console.log('\n💡 Solutions possibles:');
      console.log('1. Exécuter: node backend/seed-enseignant-programmes.js');
      console.log('2. Vérifier les associations enseignant-module');
      console.log('3. Vérifier qu\'il y a des programmes avec status "مقبول"');
    }

    // Test 5: Récupérer tous les programmes (pour debug)
    console.log('\n5. Test récupération de tous les programmes (debug)');
    try {
      const allProgrammesResponse = await axios.get(`${BASE_URL}/programme`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const allProgrammes = allProgrammesResponse.data;
      console.log(`✅ Total programmes dans le système: ${allProgrammes.length}`);
      
      const programmesValides = allProgrammes.filter(p => p.status === 'مقبول');
      console.log(`✅ Programmes validés dans le système: ${programmesValides.length}`);
      
      if (programmesValides.length > 0) {
        console.log('Programmes validés:');
        programmesValides.slice(0, 3).forEach(p => {
          console.log(`- ${p.code_programme}: ${p.titre_fr} (Module: ${p.id_module})`);
        });
      }
    } catch (allError) {
      console.log('⚠️ Impossible de récupérer tous les programmes');
    }

    console.log('\n🎉 Tests terminés !');

  } catch (error) {
    console.error('❌ Erreur lors du test:');
    console.error('URL:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    if (error.response?.data?.error) {
      console.error('Détails:', error.response.data.error);
    }
  }
}

testEnseignantAPI().catch(console.error);

const axios = require('axios');

async function testPDFServing() {
  console.log('🧪 Test du service de fichiers PDF...\n');

  const baseUrl = 'http://localhost:3000';
  const testFiles = [
    'programme-web-2024.pdf',
    'formation-sql-avancee.pdf',
    'cours-programmation-c.pdf'
  ];

  // Test sans authentification (devrait échouer)
  console.log('1. Test sans token d\'authentification...');
  try {
    const response = await axios.get(`${baseUrl}/programme/pdf/${testFiles[0]}`);
    console.log('❌ ERREUR: Accès autorisé sans authentification');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Authentification requise (correct)');
    } else {
      console.log('⚠️ Erreur inattendue:', error.response?.status);
    }
  }

  // Test avec faux token
  console.log('\n2. Test avec faux token...');
  try {
    const response = await axios.get(`${baseUrl}/programme/pdf/${testFiles[0]}`, {
      headers: {
        'Authorization': 'Bearer fake-token'
      }
    });
    console.log('❌ ERREUR: Accès autorisé avec faux token');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('✅ Faux token rejeté (correct)');
    } else {
      console.log('⚠️ Erreur inattendue:', error.response?.status);
    }
  }

  // Test fichier inexistant (avec token valide nécessaire)
  console.log('\n3. Test fichier inexistant...');
  console.log('📝 Pour tester complètement, il faut :');
  console.log('   - Démarrer le serveur backend');
  console.log('   - Se connecter pour obtenir un token valide');
  console.log('   - Utiliser ce token pour tester les endpoints');

  console.log('\n🔗 URLs de test (nécessitent authentification):');
  testFiles.forEach(filename => {
    console.log(`${baseUrl}/programme/pdf/${filename}`);
  });

  console.log('\n📋 Checklist pour test manuel:');
  console.log('1. ✅ Serveur démarré');
  console.log('2. ⏳ Connexion utilisateur');
  console.log('3. ⏳ Test visualisation PDF dans l\'interface');
  console.log('4. ⏳ Test téléchargement PDF');
  console.log('5. ⏳ Test upload nouveau PDF');
}

testPDFServing().catch(console.error);

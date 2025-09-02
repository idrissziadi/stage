const http = require('http');

async function testAPILive() {
  console.log('🧪 Test de l\'API en direct après redémarrage\n');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/ens-module/enseignant/403/modules',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer test',
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`📡 Status: ${res.statusCode}`);
      console.log(`📡 Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Réponse API:');
          console.log(JSON.stringify(response, null, 2));
          
          if (response.data && Array.isArray(response.data)) {
            console.log(`\n🎯 Modules trouvés: ${response.data.length}`);
            response.data.forEach((module, index) => {
              console.log(`   ${index + 1}. ${module.designation_fr || module.designation_ar} (${module.code_module})`);
            });
          } else {
            console.log('❌ Structure de réponse inattendue');
          }
          
          resolve(response);
        } catch (error) {
          console.log('❌ Erreur parsing JSON:', error.message);
          console.log('📄 Données brutes:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erreur de requête:', error.message);
      reject(error);
    });

    req.end();
  });
}

// Test avec délai pour laisser le serveur démarrer
setTimeout(() => {
  testAPILive()
    .then(() => {
      console.log('\n✅ Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test échoué:', error.message);
      process.exit(1);
    });
}, 3000); // Attendre 3 secondes

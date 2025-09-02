const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testProgrammeAPI() {
  console.log('🧪 Testing Programme API...\n');

  try {
    // Test 1: Test de la route des programmes par enseignant
    console.log('1️⃣ Testing /programme/enseignant/:id route...');
    
    // Utiliser un ID d'enseignant existant
    const enseignantId = 1;
    const programmesResponse = await fetch(`${BASE_URL}/programme/enseignant/${enseignantId}`);
    
    console.log('Status:', programmesResponse.status);
    
    if (programmesResponse.ok) {
      const programmesData = await programmesResponse.json();
      console.log('Programmes response structure:', JSON.stringify(programmesData, null, 2));
      
      if (programmesData && Array.isArray(programmesData)) {
        console.log(`\n📊 Found ${programmesData.length} programmes`);
        
        programmesData.forEach((programme, index) => {
          console.log(`\n--- Programme ${index + 1} ---`);
          console.log('ID:', programme.id_programme);
          console.log('Code:', programme.code_programme);
          console.log('Titre:', programme.titre_ar || programme.titre_fr);
          console.log('Status:', programme.status);
          console.log('Created At:', programme.createdAt);
          console.log('Updated At:', programme.updatedAt);
          console.log('Created At (raw):', programme.created_at);
          console.log('Updated At (raw):', programme.updated_at);
          
          // Vérifier la présence des timestamps
          const hasTimestamps = programme.createdAt || programme.updatedAt || programme.created_at || programme.updated_at;
          console.log('Has Timestamps:', hasTimestamps ? '✅ Oui' : '❌ Non');
          
          if (hasTimestamps) {
            console.log('✅ Timestamps found - API working correctly');
          } else {
            console.log('❌ No timestamps found - API not returning timestamps');
          }
        });
      } else {
        console.log('❌ No programmes data found or invalid structure');
      }
    } else {
      console.log('❌ Error response:', await programmesResponse.text());
    }

  } catch (error) {
    console.error('❌ Error testing programme API:', error.message);
  }
}

testProgrammeAPI();

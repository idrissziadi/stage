const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testProgrammeDates() {
  console.log('🧪 Testing Programme Dates...\n');

  try {
    // Test 1: Test de la route des programmes par enseignant
    console.log('1️⃣ Testing /programme/enseignant/:id route...');
    
    // Utiliser un ID d'enseignant existant (remplacer par un vrai ID si nécessaire)
    const enseignantId = 1;
    const programmesResponse = await fetch(`${BASE_URL}/programme/enseignant/${enseignantId}`);
    
    console.log('Status:', programmesResponse.status);
    
    if (programmesResponse.ok) {
      const programmesData = await programmesResponse.json();
      console.log('Programmes response structure:', JSON.stringify(programmesData, null, 2));
      
      if (programmesData.data && Array.isArray(programmesData.data)) {
        console.log(`\n📊 Found ${programmesData.data.length} programmes`);
        
        programmesData.data.forEach((programme, index) => {
          console.log(`\n--- Programme ${index + 1} ---`);
          console.log('ID:', programme.id_programme);
          console.log('Code:', programme.code_programme);
          console.log('Titre:', programme.titre_ar || programme.titre_fr);
          console.log('Status:', programme.status);
          console.log('Created At (raw):', programme.created_at);
          console.log('Updated At (raw):', programme.updated_at);
          
          // Test de parsing des dates
          if (programme.created_at) {
            const createdDate = new Date(programme.created_at);
            console.log('Created At (parsed):', createdDate);
            console.log('Is Valid Date:', !isNaN(createdDate.getTime()));
            console.log('Timestamp:', createdDate.getTime());
          }
          
          if (programme.updated_at) {
            const updatedDate = new Date(programme.updated_at);
            console.log('Updated At (parsed):', updatedDate);
            console.log('Is Valid Date:', !isNaN(updatedDate.getTime()));
            console.log('Timestamp:', updatedDate.getTime());
          }
          
          // Test de formatage arabe
          if (programme.created_at) {
            try {
              const date = new Date(programme.created_at);
              if (!isNaN(date.getTime())) {
                const arabicDate = date.toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                console.log('Arabic Format:', arabicDate);
              } else {
                console.log('❌ Invalid date - cannot format');
              }
            } catch (error) {
              console.log('❌ Error formatting date:', error.message);
            }
          }
        });
      } else {
        console.log('❌ No programmes data found or invalid structure');
      }
    } else {
      console.log('❌ Error response:', await programmesResponse.text());
    }

  } catch (error) {
    console.error('❌ Error testing programme dates:', error.message);
  }
}

testProgrammeDates();

// Test script for Stagiaire API endpoints
// Run this after starting the server to verify the fixes

const axios = require('axios');

const API_BASE = 'http://localhost:3000';

// Test function
async function testStagiaireAPIs() {
  try {
    console.log('🧪 Testing Stagiaire API Endpoints...\n');

    // Test 1: Test memoire/stagiaire/:id_stagiaire
    console.log('1️⃣ Testing GET /memoire/stagiaire/2');
    try {
      const response1 = await axios.get(`${API_BASE}/memoire/stagiaire/2`);
      console.log('✅ Success:', response1.status, '- Found', response1.data.length, 'memoires');
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.error || error.message);
    }

    console.log('');

    // Test 2: Test memoire/collaboratifs/:id_stagiaire
    console.log('2️⃣ Testing GET /memoire/collaboratifs/2');
    try {
      const response2 = await axios.get(`${API_BASE}/memoire/collaboratifs/2`);
      console.log('✅ Success:', response2.status, '- Found', response2.data.length, 'collaborative memoires');
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.error || error.message);
    }

    console.log('');

    // Test 3: Test inscription/stagiaire/:id_stagiaire
    console.log('3️⃣ Testing GET /inscription/stagiaire/2');
    try {
      const response3 = await axios.get(`${API_BASE}/inscription/stagiaire/2`);
      console.log('✅ Success:', response3.status, '- Found', response3.data.length, 'inscriptions');
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.error || error.message);
    }

    console.log('');

    // Test 4: Test cours/stagiaire/:id_stagiaire
    console.log('4️⃣ Testing GET /cours/stagiaire/2');
    try {
      const response4 = await axios.get(`${API_BASE}/cours/stagiaire/2`);
      console.log('✅ Success:', response4.status, '- Found', response4.data.length, 'courses');
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.error || error.message);
    }

    console.log('\n🎉 API Testing Complete!\n');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  console.log('⚠️  Make sure the backend server is running on port 3000');
  console.log('⚠️  This test uses stagiaire ID 2 - make sure this exists in your database\n');
  
  testStagiaireAPIs().then(() => {
    console.log('📝 To create test data, you can:');
    console.log('   - Add a stagiaire with ID 2');
    console.log('   - Add some inscriptions for this stagiaire');
    console.log('   - Add some memoires and courses');
    console.log('   - Run this test again');
  });
}

module.exports = testStagiaireAPIs;
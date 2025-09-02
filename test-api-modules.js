const fetch = require('node-fetch');

async function testModulesAPI() {
  try {
    console.log('🔍 Testing modules API endpoint...');
    
    // Test the API endpoint
    const response = await fetch('http://localhost:3000/module/enseignant/312');
    const data = await response.json();
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Headers:', response.headers.raw());
    console.log('📡 API Response Data:', JSON.stringify(data, null, 2));
    console.log('📡 Data type:', typeof data);
    console.log('📡 Data keys:', Object.keys(data || {}));
    
    if (data.data) {
      console.log('📊 Data.data type:', typeof data.data);
      console.log('📊 Data.data is array:', Array.isArray(data.data));
      console.log('📊 Data.data length:', data.data ? data.data.length : 'undefined');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testModulesAPI();

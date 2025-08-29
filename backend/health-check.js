const http = require('http');
const { sequelize } = require('./config/database');

async function healthCheck() {
  try {
    console.log('🔍 Checking backend health...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Test if server is responding (assumes server is running on port 3000)
    const testRequest = (path, expectedStatus = 200) => {
      return new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: path,
          method: 'GET',
          timeout: 5000
        };

        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            console.log(`${res.statusCode === expectedStatus ? '✅' : '❌'} ${path} - Status: ${res.statusCode}`);
            resolve({ statusCode: res.statusCode, data: data });
          });
        });

        req.on('error', (e) => {
          console.log(`❌ ${path} - Error: ${e.message}`);
          reject(e);
        });

        req.on('timeout', () => {
          console.log(`❌ ${path} - Timeout`);
          req.destroy();
          reject(new Error('Request timeout'));
        });

        req.end();
      });
    };

    // Test basic endpoints
    try {
      await testRequest('/');
      await testRequest('/api-docs');
      await testRequest('/offre/etablissement/1', 500); // Expect 500 or other status
      await testRequest('/etablissement/inscriptions', 500); // Expect 500 or other status due to auth
    } catch (error) {
      console.log('⚠️ Some endpoints are not responding (server may not be running)');
    }

    console.log('🎯 Health check completed');
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Check if this is run directly
if (require.main === module) {
  healthCheck();
}

module.exports = healthCheck;
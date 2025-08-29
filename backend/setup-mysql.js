// setup-mysql.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const setupDatabase = async () => {
  console.log('🚀 Starting MySQL database setup...');
  
  try {
    // Create connection without database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ziadi',
      multipleStatements: true
    });
    
    console.log('✓ Connected to MySQL server');
    
    // Read and execute the setup SQL file
    const setupSQL = fs.readFileSync(path.join(__dirname, 'mysql_setup.sql'), 'utf8');
    
    console.log('📋 Executing database setup script...');
    await connection.execute(setupSQL);
    
    console.log('✓ Database setup completed successfully!');
    console.log(`✓ Database "${process.env.DB_NAME || 'formation_db'}" is ready`);
    console.log('✓ Sample data inserted');
    
    // Test the connection with Sequelize
    console.log('\n🔧 Testing Sequelize connection...');
    const { sequelize } = require('./config/database');
    
    await sequelize.authenticate();
    console.log('✓ Sequelize connection established');
    
    // Close connections
    await connection.end();
    await sequelize.close();
    
    console.log('\n🎉 MySQL setup completed successfully!');
    console.log('📝 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: password123');
    console.log('\n🌐 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Error during database setup:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Solution: Check your MySQL credentials in the .env file');
      console.error('   DB_USER and DB_PASSWORD should match your MySQL configuration');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Solution: Make sure MySQL server is running');
      console.error('   - Start MySQL service on your system');
      console.error('   - Check if port 3306 is available');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 The database will be created automatically');
    }
    
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
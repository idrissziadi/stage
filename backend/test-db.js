const { sequelize } = require('./config/database');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test authentication
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test if database exists
    const [results] = await sequelize.query('SELECT DATABASE() as db_name');
    console.log('📊 Connected to database:', results[0].db_name);
    
    // List existing tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📋 Existing tables:', tables.length);
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found. Database needs to be initialized.');
      console.log('Run: npm run migrate or node sync-db.js');
    } else {
      console.log('Tables:', tables.map(t => Object.values(t)[0]).join(', '));
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure MySQL/MariaDB is running');
      console.log('2. Check if port 3306 is open');
      console.log('3. Verify username/password in config/database.js');
    }
    
    if (error.message.includes('Access denied')) {
      console.log('\n🔧 Database access issue:');
      console.log('1. Check username/password in config/database.js');
      console.log('2. Make sure the database user has proper permissions');
    }
    
    if (error.message.includes('Unknown database')) {
      console.log('\n🔧 Database does not exist:');
      console.log('1. Create database: CREATE DATABASE formation_db;');
      console.log('2. Or run the init_database.sql script');
    }
  }
  
  await sequelize.close();
}

testDatabaseConnection();
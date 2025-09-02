// insert-enseignants.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const insertEnseignants = async () => {
  console.log('🚀 Starting insertion of enseignants...');
  
  try {
    // Create connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ziadi',
      database: process.env.DB_NAME || 'formation_db',
      multipleStatements: true
    });
    
    console.log('✓ Connected to MySQL database');
    
    // First, let's check if we have the required tables and data
    console.log('🔍 Checking database structure...');
    
    // Check if Grade table has the required grades (12-18)
    const [grades] = await connection.execute('SELECT id_grade, code_grade, designation_fr FROM Grade WHERE id_grade BETWEEN 12 AND 18');
    console.log(`✓ Found ${grades.length} grades in range 12-18`);
    
    if (grades.length === 0) {
      console.log('⚠️ No grades found in range 12-18. Creating them...');
      
      // Insert grades 12-18
      const gradeInserts = [];
      for (let i = 12; i <= 18; i++) {
        gradeInserts.push(`(${i}, 'GRADE${i}', 'Grade ${i}', 'الدرجة ${i}')`);
      }
      
      await connection.execute(`
        INSERT IGNORE INTO Grade (id_grade, code_grade, designation_fr, designation_ar) VALUES 
        ${gradeInserts.join(', ')}
      `);
      console.log('✓ Grades 12-18 created');
    }
    
    // Check if EtablissementFormation table has establishments 1-91
    const [etabs] = await connection.execute('SELECT id_etab_formation, code, nom_fr FROM EtablissementFormation WHERE id_etab_formation BETWEEN 1 AND 91');
    console.log(`✓ Found ${etabs.length} establishments in range 1-91`);
    
    if (etabs.length === 0) {
      console.log('⚠️ No establishments found in range 1-91. Creating them...');
      
      // Insert establishments 1-91
      const etabInserts = [];
      for (let i = 1; i <= 91; i++) {
        etabInserts.push(`(${i}, 'ETAB${i.toString().padStart(3, '0')}', 'Établissement ${i}', 'المؤسسة ${i}')`);
      }
      
      await connection.execute(`
        INSERT IGNORE INTO EtablissementFormation (id_etab_formation, code, nom_fr, nom_ar) VALUES 
        ${etabInserts.join(', ')}
      `);
      console.log('✓ Establishments 1-91 created');
    }
    
    // Now let's insert the enseignants
    console.log('📝 Inserting enseignants...');
    
    // Read the SQL file content
    const sqlFile = path.join(__dirname, '..', 'insert_enseignants_data.sql');
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL file not found: ${sqlFile}`);
    }
    
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split the SQL content into individual INSERT statements
    const insertStatements = sqlContent
      .split(';')
      .filter(stmt => stmt.trim().startsWith('INSERT INTO Enseignant'))
      .map(stmt => stmt.trim() + ';');
    
    console.log(`📋 Found ${insertStatements.length} INSERT statements`);
    
    // Execute each INSERT statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < insertStatements.length; i++) {
      try {
        const stmt = insertStatements[i];
        if (stmt.trim()) {
          await connection.execute(stmt);
          successCount++;
          if (successCount % 10 === 0) {
            console.log(`✓ Inserted ${successCount} enseignants...`);
          }
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error in statement ${i + 1}:`, error.message);
        // Continue with next statement
      }
    }
    
    // Now insert additional enseignants
    console.log('📝 Inserting additional enseignants...');
    
    const additionalSqlFile = path.join(__dirname, '..', 'insert_enseignants_additional.sql');
    if (fs.existsSync(additionalSqlFile)) {
      const additionalSqlContent = fs.readFileSync(additionalSqlFile, 'utf8');
      
      const additionalInsertStatements = additionalSqlContent
        .split(';')
        .filter(stmt => stmt.trim().startsWith('INSERT INTO Enseignant'))
        .map(stmt => stmt.trim() + ';');
      
      console.log(`📋 Found ${additionalInsertStatements.length} additional INSERT statements`);
      
      for (let i = 0; i < additionalInsertStatements.length; i++) {
        try {
          const stmt = additionalInsertStatements[i];
          if (stmt.trim()) {
            await connection.execute(stmt);
            successCount++;
            if (successCount % 10 === 0) {
              console.log(`✓ Inserted ${successCount} enseignants...`);
            }
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ Error in additional statement ${i + 1}:`, error.message);
        }
      }
    }
    
    // Verify the insertion
    console.log('🔍 Verifying insertion...');
    
    const [totalCount] = await connection.execute('SELECT COUNT(*) as total FROM Enseignant');
    const [nullCompteCount] = await connection.execute('SELECT COUNT(*) as total FROM Enseignant WHERE compte_id IS NULL');
    const [gradeRangeCount] = await connection.execute('SELECT COUNT(*) as total FROM Enseignant WHERE id_grade BETWEEN 12 AND 18');
    const [etabRangeCount] = await connection.execute('SELECT COUNT(*) as total FROM Enseignant WHERE id_etab_formation BETWEEN 1 AND 91');
    
    console.log('\n📊 Insertion Results:');
    console.log(`✓ Total enseignants: ${totalCount[0].total}`);
    console.log(`✓ Enseignants with compte_id NULL: ${nullCompteCount[0].total}`);
    console.log(`✓ Enseignants with grade 12-18: ${gradeRangeCount[0].total}`);
    console.log(`✓ Enseignants with etab_formation 1-91: ${etabRangeCount[0].total}`);
    console.log(`✓ Successfully inserted: ${successCount}`);
    console.log(`✓ Errors encountered: ${errorCount}`);
    
    // Close connection
    await connection.end();
    
    console.log('\n🎉 Enseignants insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during enseignants insertion:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Solution: Check your MySQL credentials in the .env file');
      console.error('   DB_USER and DB_PASSWORD should match your MySQL configuration');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Solution: Make sure MySQL server is running');
      console.error('   - Start MySQL service on your system');
      console.error('   - Check if port 3306 is available');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Solution: Run setup-mysql.js first to create the database');
    }
    
    process.exit(1);
  }
};

// Run insertion if called directly
if (require.main === module) {
  insertEnseignants();
}

module.exports = insertEnseignants;

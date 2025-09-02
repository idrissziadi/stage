const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stage_db'
};

async function testSimpleEtablissementRegionale() {
  console.log('🧪 Test simple de la base de données pour EtablissementRegionale\n');

  let connection;
  
  try {
    // Test 1: Connexion à la base de données
    console.log('1️⃣ Test: Connexion à la base de données');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion réussie à la base de données');
    console.log('');

    // Test 2: Vérifier la table Compte
    console.log('2️⃣ Test: Table Compte');
    const [comptes] = await connection.execute(`
      SELECT id_compte, username, role, created_at 
      FROM Compte 
      WHERE role = 'EtablissementRegionale'
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    if (comptes.length > 0) {
      console.log('✅ Utilisateurs EtablissementRegionale trouvés:');
      comptes.forEach(compte => {
        console.log(`   - ID: ${compte.id_compte}, Username: ${compte.username}, Créé: ${compte.created_at}`);
      });
    } else {
      console.log('❌ Aucun utilisateur EtablissementRegionale trouvé dans Compte');
    }
    console.log('');

    // Test 3: Vérifier la table EtablissementRegionale
    console.log('3️⃣ Test: Table EtablissementRegionale');
    const [etablissements] = await connection.execute(`
      SELECT id_etab_regionale, code, nom_fr, nom_ar, compte_id, created_at
      FROM EtablissementRegionale 
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    if (etablissements.length > 0) {
      console.log('✅ Établissements régionaux trouvés:');
      etablissements.forEach(etab => {
        console.log(`   - ID: ${etab.id_etab_regionale}, Code: ${etab.code}, Nom: ${etab.nom_fr}, Compte: ${etab.compte_id}`);
      });
    } else {
      console.log('❌ Aucun établissement régional trouvé');
    }
    console.log('');

    // Test 4: Vérifier la relation entre Compte et EtablissementRegionale
    console.log('4️⃣ Test: Relation Compte ↔ EtablissementRegionale');
    const [relations] = await connection.execute(`
      SELECT 
        c.id_compte,
        c.username,
        c.role,
        e.id_etab_regionale,
        e.code,
        e.nom_fr
      FROM Compte c
      LEFT JOIN EtablissementRegionale e ON c.id_compte = e.compte_id
      WHERE c.role = 'EtablissementRegionale'
      ORDER BY c.created_at DESC
      LIMIT 5
    `);
    
    if (relations.length > 0) {
      console.log('✅ Relations trouvées:');
      relations.forEach(rel => {
        if (rel.id_etab_regionale) {
          console.log(`   ✅ Compte ${rel.username} → Établissement ${rel.code} (${rel.nom_fr})`);
        } else {
          console.log(`   ❌ Compte ${rel.username} → Aucun établissement associé`);
        }
      });
    } else {
      console.log('❌ Aucune relation trouvée');
    }
    console.log('');

    // Test 5: Vérifier l'utilisateur spécifique IFEP-SETIF
    console.log('5️⃣ Test: Utilisateur IFEP-SETIF');
    const [userIFEP] = await connection.execute(`
      SELECT 
        c.id_compte,
        c.username,
        c.role,
        c.created_at,
        e.id_etab_regionale,
        e.code,
        e.nom_fr,
        e.nom_ar
      FROM Compte c
      LEFT JOIN EtablissementRegionale e ON c.id_compte = e.compte_id
      WHERE c.username = 'IFEP-SETIF'
    `);
    
    if (userIFEP.length > 0) {
      const user = userIFEP[0];
      console.log('✅ Utilisateur IFEP-SETIF trouvé:');
      console.log(`   - ID Compte: ${user.id_compte}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Créé: ${user.created_at}`);
      
      if (user.id_etab_regionale) {
        console.log(`   - ID Établissement: ${user.id_etab_regionale}`);
        console.log(`   - Code: ${user.code}`);
        console.log(`   - Nom FR: ${user.nom_fr}`);
        console.log(`   - Nom AR: ${user.nom_ar}`);
      } else {
        console.log('   ❌ Aucun établissement associé');
        console.log('   💡 Solution: Créer un enregistrement dans EtablissementRegionale');
      }
    } else {
      console.log('❌ Utilisateur IFEP-SETIF non trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

// Exécution des tests
if (require.main === module) {
  console.log('🚀 Démarrage des tests de la base de données...\n');
  testSimpleEtablissementRegionale();
}

module.exports = { testSimpleEtablissementRegionale };

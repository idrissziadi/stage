const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3001';
const TOKEN = 'VOTRE_TOKEN_ICI'; // Remplacez par un token valide

// Headers avec authentification
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function testEnsModuleAPI() {
  console.log('🧪 Test de l\'API EnsModule (Assignation module-enseignant)\n');

  try {
    // Test 1: Récupérer les modules disponibles pour un enseignant
    console.log('1️⃣ Test: Récupérer les modules disponibles pour un enseignant');
    console.log('GET /ens-module/enseignant/1/modules-disponibles');
    
    const response1 = await axios.get(`${BASE_URL}/ens-module/enseignant/1/modules-disponibles`, { headers });
    
    console.log('✅ Succès!');
    console.log('📊 Données reçues:');
    console.log(`   - Enseignant: ${response1.data.enseignant.nom_fr} ${response1.data.enseignant.prenom_fr}`);
    console.log(`   - Établissement: ${response1.data.enseignant.etablissement.nom_fr}`);
    console.log(`   - Offres trouvées: ${response1.data.offres}`);
    console.log(`   - Spécialités: ${response1.data.specialites}`);
    console.log(`   - Modules disponibles: ${response1.data.modules.length}`);
    
    if (response1.data.modules.length > 0) {
      console.log('   - Exemples de modules:');
      response1.data.modules.slice(0, 3).forEach(module => {
        console.log(`     • ${module.code_module}: ${module.designation_fr} (${module.specialite.designation_fr})`);
      });
    }
    console.log('');

    // Test 2: Assigner des modules à un enseignant
    if (response1.data.modules.length > 0) {
      console.log('2️⃣ Test: Assigner des modules à un enseignant');
      console.log('POST /ens-module/enseignant/1/assigner');
      
      const modulesToAssign = response1.data.modules.slice(0, 2).map(m => m.id_module);
      const assignData = {
        modules: modulesToAssign,
        annee_scolaire: '2024-09-01',
        semestre: 'S1'
      };
      
      console.log('📝 Données d\'assignation:', assignData);
      
      const response2 = await axios.post(`${BASE_URL}/ens-module/enseignant/1/assigner`, assignData, { headers });
      
      console.log('✅ Succès!');
      console.log('📊 Assignation effectuée:');
      console.log(`   - ${response2.data.total_modules} module(s) assigné(s)`);
      console.log(`   - Année scolaire: ${response2.data.annee_scolaire}`);
      console.log(`   - Semestre: ${response2.data.semestre}`);
      console.log('   - Modules assignés:');
      response2.data.modules_assigned.forEach(module => {
        console.log(`     • ${module.code_module}: ${module.designation_fr}`);
      });
      console.log('');

      // Test 3: Récupérer les modules assignés à l'enseignant
      console.log('3️⃣ Test: Récupérer les modules assignés à l\'enseignant');
      console.log('GET /ens-module/enseignant/1/modules');
      
      const response3 = await axios.get(`${BASE_URL}/ens-module/enseignant/1/modules`, { headers });
      
      console.log('✅ Succès!');
      console.log('📊 Modules assignés:');
      console.log(`   - Total: ${response3.data.total_modules} module(s)`);
      console.log('   - Par année scolaire:');
      
      Object.entries(response3.data.modules_by_year).forEach(([year, modules]) => {
        console.log(`     • ${year}: ${modules.length} module(s)`);
        modules.forEach(module => {
          console.log(`       - ${module.code_module}: ${module.designation_fr} (${module.semestre || 'N/A'})`);
        });
      });
      console.log('');

      // Test 4: Retirer un module de l'enseignant
      if (response3.data.total_modules > 0) {
        console.log('4️⃣ Test: Retirer un module de l\'enseignant');
        console.log('DELETE /ens-module/enseignant/1/module/{id_module}/2024-09-01');
        
        const moduleToRemove = response3.data.modules_by_year['2024-09-01'][0];
        console.log(`📝 Suppression du module: ${moduleToRemove.code_module} (ID: ${moduleToRemove.id_module})`);
        
        const response4 = await axios.delete(
          `${BASE_URL}/ens-module/enseignant/1/module/${moduleToRemove.id_module}/2024-09-01`, 
          { headers }
        );
        
        console.log('✅ Succès!');
        console.log('📊 Module retiré:');
        console.log(`   - Module ID: ${response4.data.module_id}`);
        console.log(`   - Enseignant ID: ${response4.data.enseignant_id}`);
        console.log(`   - Année scolaire: ${response4.data.annee_scolaire}`);
        console.log('');
      }
    }

    console.log('🎉 Tous les tests ont réussi! L\'API EnsModule fonctionne correctement.');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Solution: Vérifiez que votre token d\'authentification est valide');
    } else if (error.response?.status === 404) {
      console.log('\n💡 Solution: Vérifiez que l\'enseignant avec l\'ID 1 existe');
    }
  }
}

// Fonction pour tester avec un enseignant spécifique
async function testWithSpecificEnseignant(enseignantId) {
  console.log(`\n🔍 Test spécifique pour l'enseignant ID: ${enseignantId}`);
  
  try {
    const response = await axios.get(`${BASE_URL}/ens-module/enseignant/${enseignantId}/modules-disponibles`, { headers });
    
    console.log('✅ Modules disponibles:');
    console.log(`   - Enseignant: ${response.data.enseignant.nom_fr} ${response.data.enseignant.prenom_fr}`);
    console.log(`   - Établissement: ${response.data.enseignant.etablissement.nom_fr}`);
    console.log(`   - Modules: ${response.data.modules.length}`);
    
    if (response.data.modules.length > 0) {
      console.log('   - Liste des modules:');
      response.data.modules.forEach(module => {
        console.log(`     • ${module.code_module}: ${module.designation_fr} (${module.specialite.designation_fr})`);
      });
    }
    
  } catch (error) {
    console.error(`❌ Erreur pour l'enseignant ${enseignantId}:`, error.response?.data?.message || error.message);
  }
}

// Exécution des tests
if (require.main === module) {
  console.log('🚀 Démarrage des tests de l\'API EnsModule...\n');
  
  // Test principal
  testEnsModuleAPI();
  
  // Tests avec des enseignants spécifiques (décommentez si nécessaire)
  // setTimeout(() => testWithSpecificEnseignant(2), 2000);
  // setTimeout(() => testWithSpecificEnseignant(3), 4000);
}

module.exports = { testEnsModuleAPI, testWithSpecificEnseignant };

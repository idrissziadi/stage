const { sequelize } = require('./config/database');
const Module = require('./models/Module');

// Setup associations
require('./models/associations')();

async function testModuleAPI() {
  console.log('🧪 Test de l\'API des modules...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Test de récupération des modules
    console.log('\n1. Récupération des modules...');
    const modules = await Module.findAll({
      attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
      order: [['id_module', 'ASC']]
    });

    console.log(`Modules trouvés: ${modules.length}`);

    if (modules.length === 0) {
      console.log('❌ Aucun module trouvé');
      console.log('💡 Créons quelques modules de test...');
      
      // Créer des modules de test
      const testModules = [
        {
          code_module: 'M001',
          designation_fr: 'Module Test 1',
          designation_ar: 'وحدة اختبار 1',
          id_specialite: 1
        },
        {
          code_module: 'M002', 
          designation_fr: 'Module Test 2',
          designation_ar: 'وحدة اختبار 2',
          id_specialite: 1
        }
      ];

      for (const moduleData of testModules) {
        try {
          await Module.create(moduleData);
          console.log(`✅ Module créé: ${moduleData.code_module}`);
        } catch (error) {
          console.log(`⚠️ Erreur création ${moduleData.code_module}:`, error.message);
        }
      }

      // Re-récupérer les modules
      const newModules = await Module.findAll({
        attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module'],
        order: [['id_module', 'ASC']]
      });
      
      console.log(`\nModules après création: ${newModules.length}`);
      modules.length = 0;
      modules.push(...newModules);
    }

    // Afficher les modules
    console.log('\n📋 Liste des modules:');
    modules.forEach((module, index) => {
      console.log(`${index + 1}. ID: ${module.id_module}`);
      console.log(`   Code: ${module.code_module}`);
      console.log(`   FR: ${module.designation_fr}`);
      console.log(`   AR: ${module.designation_ar || 'N/A'}`);
      console.log('');
    });

    // Test structure JSON
    console.log('🔗 Structure JSON attendue par le frontend:');
    const jsonStructure = modules.map(m => ({
      id_module: m.id_module,
      designation_fr: m.designation_fr,
      designation_ar: m.designation_ar,
      code_module: m.code_module
    }));

    console.log(JSON.stringify(jsonStructure.slice(0, 2), null, 2));

    console.log('\n✅ L\'API /module devrait retourner cette structure');
    console.log('\n📱 Test Frontend:');
    console.log('1. Aller dans "إنشاء برنامج"');
    console.log('2. Le dropdown "الوحدة" devrait afficher ces modules');
    console.log('3. Pas d\'erreur "modules.map is not a function"');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

testModuleAPI();

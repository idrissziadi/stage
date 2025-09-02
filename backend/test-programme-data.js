const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const EnsModule = require('./models/Ens_Module');
const Enseignant = require('./models/Enseignant');

// Setup associations
require('./models/associations')();

async function testProgrammeData() {
  console.log('🔍 Test des données Programme...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Test 1: Vérifier qu'il y a des enseignants
    console.log('\n1. Test enseignants');
    const enseignants = await Enseignant.findAll({ limit: 5 });
    console.log(`✅ Trouvé ${enseignants.length} enseignants`);
    if (enseignants.length > 0) {
      console.log('Premier enseignant:', enseignants[0].dataValues);
    }

    // Test 2: Vérifier les modules
    console.log('\n2. Test modules');
    const modules = await Module.findAll({ limit: 5 });
    console.log(`✅ Trouvé ${modules.length} modules`);
    if (modules.length > 0) {
      console.log('Premier module:', modules[0].dataValues);
    }

    // Test 3: Vérifier les associations enseignant-module
    console.log('\n3. Test associations enseignant-module');
    const ensModules = await EnsModule.findAll({ 
      where: { id_enseignant: 2 },
      limit: 5 
    });
    console.log(`✅ Trouvé ${ensModules.length} associations pour enseignant ID=2`);
    ensModules.forEach(em => {
      console.log(`- Enseignant ${em.id_enseignant} -> Module ${em.id_module}`);
    });

    // Test 4: Vérifier les programmes
    console.log('\n4. Test programmes');
    const programmes = await Programme.findAll({ limit: 5 });
    console.log(`✅ Trouvé ${programmes.length} programmes`);
    if (programmes.length > 0) {
      console.log('Premier programme:', programmes[0].dataValues);
    }

    // Test 5: Test de la requête complète pour l'enseignant 2
    console.log('\n5. Test requête complète pour enseignant ID=2');
    
    // Récupérer les modules de l'enseignant
    const modulesEnseignes = await EnsModule.findAll({
      where: { id_enseignant: 2 },
      attributes: ['id_module']
    });
    
    const moduleIds = modulesEnseignes.map(em => em.id_module);
    console.log('Modules enseignés:', moduleIds);

    if (moduleIds.length > 0) {
      // Récupérer les programmes pour ces modules
      const { Op } = require('sequelize');
      const programmesEnseignant = await Programme.findAll({
        where: { 
          id_module: { [Op.in]: moduleIds },
          status: 'مقبول'
        },
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['designation_fr', 'designation_ar', 'code_module']
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['nom_fr', 'nom_ar']
          }
        ],
        order: [['id_programme', 'DESC']]
      });
      
      console.log(`✅ Trouvé ${programmesEnseignant.length} programmes validés pour l'enseignant`);
      if (programmesEnseignant.length > 0) {
        console.log('Premier programme avec relations:', JSON.stringify(programmesEnseignant[0], null, 2));
      }
    } else {
      console.log('⚠️ Aucun module assigné à l\'enseignant');
    }

    console.log('\n🎉 Test terminé !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testProgrammeData();

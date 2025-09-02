const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const EnsModule = require('./models/Ens_Module');
const Enseignant = require('./models/Enseignant');
const { Op } = require('sequelize');

// Setup associations
require('./models/associations')();

async function diagnoseIssue() {
  console.log('🔍 Diagnostic du problème avec l\'API /programme/enseignant/2...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Test 1: Vérifier que l'enseignant existe
    console.log('\n1. Vérification enseignant ID=2');
    const enseignant = await Enseignant.findByPk(2);
    if (enseignant) {
      console.log('✅ Enseignant trouvé:', enseignant.nom_fr || enseignant.dataValues);
    } else {
      console.log('❌ Enseignant ID=2 introuvable');
      return;
    }

    // Test 2: Vérifier les modules assignés
    console.log('\n2. Modules assignés à l\'enseignant');
    const ensModules = await EnsModule.findAll({
      where: { id_enseignant: 2 },
      include: [{
        model: Module,
        as: 'module',
        attributes: ['id_module', 'designation_fr', 'code_module']
      }]
    });

    console.log(`Modules assignés: ${ensModules.length}`);
    const moduleIds = [];
    ensModules.forEach(em => {
      moduleIds.push(em.id_module);
      console.log(`- Module ${em.id_module}: ${em.module?.designation_fr || 'Nom indisponible'}`);
    });

    if (moduleIds.length === 0) {
      console.log('⚠️ Aucun module assigné à cet enseignant');
      
      // Créer une association de test
      console.log('\n📚 Création d\'une association de test...');
      const firstModule = await Module.findOne();
      if (firstModule) {
        await EnsModule.create({
          id_enseignant: 2,
          id_module: firstModule.id_module
        });
        console.log(`✅ Association créée: Enseignant 2 -> Module ${firstModule.id_module}`);
        moduleIds.push(firstModule.id_module);
      } else {
        console.log('❌ Aucun module disponible');
        return;
      }
    }

    // Test 3: Vérifier les programmes pour ces modules
    console.log('\n3. Programmes pour les modules de l\'enseignant');
    const allProgrammes = await Programme.findAll({
      where: { id_module: { [Op.in]: moduleIds } }
    });

    console.log(`Programmes trouvés pour ces modules: ${allProgrammes.length}`);
    allProgrammes.forEach(p => {
      console.log(`- ${p.code_programme}: ${p.titre_fr} (${p.status})`);
    });

    // Test 4: Programmes validés uniquement
    console.log('\n4. Programmes validés uniquement');
    const programmesValides = await Programme.findAll({
      where: { 
        id_module: { [Op.in]: moduleIds },
        status: 'مقبول'
      }
    });

    console.log(`Programmes validés: ${programmesValides.length}`);

    if (programmesValides.length === 0) {
      console.log('⚠️ Aucun programme validé trouvé');
      
      // Créer un programme de test
      console.log('\n📋 Création d\'un programme de test...');
      const etablissement = await EtablissementRegionale.findOne();
      if (etablissement) {
        await Programme.create({
          code_programme: `TEST-${Date.now()}`,
          titre_fr: 'Programme de Test',
          titre_ar: 'برنامج اختبار',
          status: 'مقبول',
          observation: 'Programme créé pour test',
          id_etab_regionale: etablissement.id_etab_regionale,
          id_module: moduleIds[0]
        });
        console.log('✅ Programme de test créé');
      }
    }

    // Test 5: Test de la requête complète avec associations
    console.log('\n5. Test requête complète avec associations');
    try {
      const programmes = await Programme.findAll({
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

      console.log(`✅ Requête réussie: ${programmes.length} programmes avec associations`);
      if (programmes.length > 0) {
        console.log('Premier programme:', JSON.stringify(programmes[0], null, 2));
      }

    } catch (associationError) {
      console.error('❌ Erreur d\'association:', associationError.message);
      console.log('\n🔧 Test avec associations simplifiées...');
      
      const programmesSimple = await Programme.findAll({
        where: { 
          id_module: { [Op.in]: moduleIds },
          status: 'مقبول'
        }
      });
      console.log(`Programmes sans associations: ${programmesSimple.length}`);
    }

    console.log('\n🎉 Diagnostic terminé !');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

diagnoseIssue();

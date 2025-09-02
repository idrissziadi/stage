const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const EnsModule = require('./models/Ens_Module');
const { Op } = require('sequelize');

// Setup associations
require('./models/associations')();

async function testEnseignantProgrammes() {
  console.log('🧪 Test simple - Programmes pour enseignant ID=2...\n');

  try {
    await sequelize.authenticate();
    
    const idEnseignant = 2;
    
    // Simuler la logique de l'API
    console.log('1. Récupération des modules enseignés...');
    const modulesEnseignes = await EnsModule.findAll({
      where: { id_enseignant: idEnseignant },
      attributes: ['id_module']
    });

    const moduleIds = modulesEnseignes.map(em => em.id_module);
    console.log(`Modules enseignés: [${moduleIds.join(', ')}]`);

    if (moduleIds.length === 0) {
      console.log('❌ Aucun module assigné');
      return;
    }

    console.log('\n2. Récupération des programmes validés...');
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

    console.log(`✅ Programmes validés trouvés: ${programmes.length}\n`);

    if (programmes.length > 0) {
      console.log('📋 Liste des programmes:');
      programmes.forEach((p, index) => {
        console.log(`${index + 1}. Code: ${p.code_programme}`);
        console.log(`   Titre FR: ${p.titre_fr}`);
        console.log(`   Titre AR: ${p.titre_ar || 'N/A'}`);
        console.log(`   Status: ${p.status}`);
        console.log(`   Module: ${p.module?.designation_fr || 'N/A'}`);
        console.log(`   Établissement: ${p.etablissementRegionale?.nom_fr || 'N/A'}`);
        console.log('');
      });

      // Format JSON comme retourné par l'API
      console.log('🔗 Format JSON (comme API):');
      console.log(JSON.stringify(programmes.map(p => ({
        id_programme: p.id_programme,
        code_programme: p.code_programme,
        titre_fr: p.titre_fr,
        titre_ar: p.titre_ar,
        status: p.status,
        module: {
          designation_fr: p.module?.designation_fr,
          designation_ar: p.module?.designation_ar,
          code_module: p.module?.code_module
        },
        etablissementRegionale: {
          nom_fr: p.etablissementRegionale?.nom_fr,
          nom_ar: p.etablissementRegionale?.nom_ar
        }
      })), null, 2));

      console.log('\n🎉 SUCCESS: L\'API devrait maintenant retourner ces programmes !');
      console.log('\n📱 Testez dans le frontend:');
      console.log('1. Connectez-vous en tant qu\'enseignant');
      console.log('2. Allez dans l\'onglet "البرامج"');
      console.log('3. Vous devriez voir ces programmes listés');

    } else {
      console.log('❌ Aucun programme validé trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

testEnseignantProgrammes();

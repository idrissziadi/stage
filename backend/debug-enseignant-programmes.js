const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const EnsModule = require('./models/Ens_Module');
const Enseignant = require('./models/Enseignant');
const { Op } = require('sequelize');

// Setup associations
require('./models/associations')();

async function debugEnseignantProgrammes() {
  console.log('🔍 Diagnostic des programmes pour enseignant...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Test avec l'enseignant ID=2 (celui qui a l'erreur 500)
    const idEnseignant = 2;

    // 1. Vérifier que l'enseignant existe
    console.log(`\n1. Vérification enseignant ID=${idEnseignant}`);
    const enseignant = await Enseignant.findByPk(idEnseignant);
    if (enseignant) {
      console.log('✅ Enseignant trouvé:', enseignant.nom_fr || enseignant.dataValues);
    } else {
      console.log('❌ Enseignant introuvable');
      return;
    }

    // 2. Vérifier les modules assignés
    console.log(`\n2. Modules assignés à l'enseignant ${idEnseignant}`);
    const modulesEnseignes = await EnsModule.findAll({
      where: { id_enseignant: idEnseignant },
      include: [{
        model: Module,
        as: 'module',
        attributes: ['id_module', 'designation_fr', 'designation_ar', 'code_module']
      }]
    });

    console.log(`Modules assignés: ${modulesEnseignes.length}`);
    const moduleIds = [];
    modulesEnseignes.forEach(em => {
      moduleIds.push(em.id_module);
      console.log(`- Module ${em.id_module}: ${em.module?.designation_fr || 'Nom indisponible'}`);
    });

    if (moduleIds.length === 0) {
      console.log('⚠️ Aucun module assigné à cet enseignant');
      
      // Créer des associations de test
      console.log('\n📚 Création d\'associations de test...');
      const modules = await Module.findAll({ limit: 2 });
      for (const module of modules) {
        const existingAssoc = await EnsModule.findOne({
          where: { id_enseignant: idEnseignant, id_module: module.id_module }
        });
        
        if (!existingAssoc) {
          await EnsModule.create({
            id_enseignant: idEnseignant,
            id_module: module.id_module
          });
          console.log(`✅ Association créée: Enseignant ${idEnseignant} -> Module ${module.id_module}`);
          moduleIds.push(module.id_module);
        }
      }
    }

    // 3. Vérifier tous les programmes pour ces modules
    console.log(`\n3. Tous les programmes pour les modules [${moduleIds.join(', ')}]`);
    const allProgrammes = await Programme.findAll({
      where: { id_module: { [Op.in]: moduleIds } }
    });

    console.log(`Programmes trouvés (tous statuts): ${allProgrammes.length}`);
    allProgrammes.forEach(p => {
      console.log(`- ${p.code_programme}: ${p.titre_fr} (${p.status}) - Module ${p.id_module}`);
    });

    // 4. Vérifier les programmes validés uniquement
    console.log(`\n4. Programmes validés uniquement`);
    const programmesValides = await Programme.findAll({
      where: { 
        id_module: { [Op.in]: moduleIds },
        status: 'مقبول'
      }
    });

    console.log(`Programmes validés: ${programmesValides.length}`);
    programmesValides.forEach(p => {
      console.log(`- ${p.code_programme}: ${p.titre_fr} (${p.status})`);
    });

    if (programmesValides.length === 0) {
      console.log('⚠️ Aucun programme validé trouvé');
      
      // Créer un programme validé de test
      console.log('\n📋 Création d\'un programme validé de test...');
      const etablissement = await EtablissementRegionale.findOne();
      if (etablissement && moduleIds.length > 0) {
        const newProgramme = await Programme.create({
          code_programme: `TEST-VAL-${Date.now()}`,
          titre_fr: 'Programme Validé de Test',
          titre_ar: 'برنامج مقبول للاختبار',
          status: 'مقبول',
          observation: 'Programme créé pour test enseignant',
          id_etab_regionale: etablissement.id_etab_regionale,
          id_module: moduleIds[0]
        });
        console.log('✅ Programme validé créé:', newProgramme.code_programme);
      }
    }

    // 5. Test de la requête API complète
    console.log(`\n5. Test de la requête API complète avec associations`);
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

      console.log(`✅ Requête API réussie: ${programmes.length} programmes avec associations`);
      programmes.forEach(p => {
        console.log(`- ${p.code_programme}: ${p.titre_fr}`);
        console.log(`  Module: ${p.module?.designation_fr || 'N/A'}`);
        console.log(`  Établissement: ${p.etablissementRegionale?.nom_fr || 'N/A'}`);
      });

    } catch (associationError) {
      console.error('❌ Erreur d\'association:', associationError.message);
    }

    console.log('\n🎉 Diagnostic terminé !');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

debugEnseignantProgrammes();

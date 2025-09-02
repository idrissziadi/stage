const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const EnsModule = require('./models/Ens_Module');
const Enseignant = require('./models/Enseignant');

// Setup associations
require('./models/associations')();

async function seedEnseignantProgrammes() {
  console.log('🌱 Création de données pour programmes enseignant...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Récupérer un enseignant (ID=2 pour l'exemple)
    const idEnseignant = 2;
    let enseignant = await Enseignant.findByPk(idEnseignant);
    
    if (!enseignant) {
      console.log('⚠️ Enseignant ID=2 introuvable. Vérifions les enseignants disponibles...');
      const enseignants = await Enseignant.findAll({ limit: 5 });
      console.log('Enseignants disponibles:');
      enseignants.forEach(e => {
        console.log(`- ID: ${e.id_enseignant}, Nom: ${e.nom_fr || e.nom_ar || 'N/A'}`);
      });
      
      if (enseignants.length > 0) {
        enseignant = enseignants[0];
        console.log(`Utilisation de l'enseignant ID: ${enseignant.id_enseignant}`);
      } else {
        console.log('❌ Aucun enseignant trouvé');
        return;
      }
    }

    // Récupérer quelques modules
    const modules = await Module.findAll({ limit: 3 });
    if (modules.length === 0) {
      console.log('❌ Aucun module trouvé');
      return;
    }

    console.log(`\n📚 Association de modules à l'enseignant ${enseignant.id_enseignant}...`);
    
    // Créer des associations enseignant-module
    for (const module of modules) {
      const existingAssoc = await EnsModule.findOne({
        where: { 
          id_enseignant: enseignant.id_enseignant, 
          id_module: module.id_module 
        }
      });

      if (!existingAssoc) {
        await EnsModule.create({
          id_enseignant: enseignant.id_enseignant,
          id_module: module.id_module
        });
        console.log(`✅ Association créée: Enseignant ${enseignant.id_enseignant} -> Module ${module.id_module} (${module.designation_fr})`);
      } else {
        console.log(`⚠️ Association existe déjà: Module ${module.id_module}`);
      }
    }

    // Récupérer un établissement régional
    const etablissement = await EtablissementRegionale.findOne();
    if (!etablissement) {
      console.log('❌ Aucun établissement régional trouvé');
      return;
    }

    console.log(`\n📋 Création de programmes validés...`);

    // Créer des programmes validés pour chaque module
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      const programmesToCreate = [
        {
          code_programme: `PROG-VAL-${module.id_module}-001`,
          titre_fr: `Programme Validé ${module.designation_fr} - Part 1`,
          titre_ar: `برنامج مقبول ${module.designation_ar || module.designation_fr} - الجزء 1`,
          status: 'مقبول',
          observation: 'Programme validé pour formation avancée',
          id_etab_regionale: etablissement.id_etab_regionale,
          id_module: module.id_module
        },
        {
          code_programme: `PROG-VAL-${module.id_module}-002`,
          titre_fr: `Programme Validé ${module.designation_fr} - Part 2`,
          titre_ar: `برنامج مقبول ${module.designation_ar || module.designation_fr} - الجزء 2`,
          status: 'مقبول',
          observation: 'Programme validé pour formation pratique',
          id_etab_regionale: etablissement.id_etab_regionale,
          id_module: module.id_module
        }
      ];

      for (const programmeData of programmesToCreate) {
        const existingProgramme = await Programme.findOne({
          where: { code_programme: programmeData.code_programme }
        });

        if (!existingProgramme) {
          const programme = await Programme.create(programmeData);
          console.log(`✅ Programme créé: ${programme.code_programme} - ${programme.titre_fr}`);
        } else {
          console.log(`⚠️ Programme existe déjà: ${programmeData.code_programme}`);
        }
      }
    }

    // Créer aussi quelques programmes en attente et refusés pour test
    console.log(`\n📋 Création de programmes avec autres statuts (pour test complet)...`);
    
    const autresProgrammes = [
      {
        code_programme: `PROG-ATT-${Date.now()}`,
        titre_fr: `Programme En Attente Test`,
        titre_ar: `برنامج في الانتظار للاختبار`,
        status: 'في_الانتظار',
        observation: null,
        id_etab_regionale: etablissement.id_etab_regionale,
        id_module: modules[0].id_module
      },
      {
        code_programme: `PROG-REF-${Date.now()}`,
        titre_fr: `Programme Refusé Test`,
        titre_ar: `برنامج مرفوض للاختبار`,
        status: 'مرفوض',
        observation: 'Programme refusé - contenu insuffisant',
        id_etab_regionale: etablissement.id_etab_regionale,
        id_module: modules[1].id_module
      }
    ];

    for (const programmeData of autresProgrammes) {
      const programme = await Programme.create(programmeData);
      console.log(`✅ Programme créé: ${programme.code_programme} (${programme.status})`);
    }

    // Vérifier le résultat final
    console.log(`\n🔍 Vérification finale...`);
    const moduleIds = modules.map(m => m.id_module);
    const programmesValides = await Programme.findAll({
      where: { 
        id_module: { [Op.in]: moduleIds },
        status: 'مقبول'
      },
      include: [
        {
          model: Module,
          as: 'module',
          attributes: ['designation_fr', 'code_module']
        }
      ]
    });

    console.log(`✅ Total programmes validés pour l'enseignant: ${programmesValides.length}`);
    programmesValides.forEach(p => {
      console.log(`- ${p.code_programme}: ${p.titre_fr} (Module: ${p.module.designation_fr})`);
    });

    console.log('\n🎉 Données créées avec succès !');
    console.log(`\n📱 Test API: GET /programme/enseignant/${enseignant.id_enseignant}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

const { Op } = require('sequelize');
seedEnseignantProgrammes();

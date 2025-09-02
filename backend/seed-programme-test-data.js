const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const EnsModule = require('./models/Ens_Module');
const Enseignant = require('./models/Enseignant');

// Setup associations
require('./models/associations')();

async function seedProgrammeData() {
  console.log('🌱 Création de données de test pour les programmes...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Vérifier si nous avons des enseignants
    const enseignants = await Enseignant.findAll({ limit: 3 });
    console.log(`Trouvé ${enseignants.length} enseignants`);

    // Vérifier si nous avons des modules
    const modules = await Module.findAll({ limit: 3 });
    console.log(`Trouvé ${modules.length} modules`);

    // Vérifier si nous avons des établissements régionaux
    const etablissements = await EtablissementRegionale.findAll({ limit: 3 });
    console.log(`Trouvé ${etablissements.length} établissements régionaux`);

    if (enseignants.length === 0 || modules.length === 0 || etablissements.length === 0) {
      console.log('⚠️ Données de base manquantes. Assurez-vous d\'avoir des enseignants, modules et établissements.');
      return;
    }

    // Créer des associations enseignant-module si elles n'existent pas
    console.log('\n📚 Création des associations enseignant-module...');
    for (let i = 0; i < Math.min(enseignants.length, modules.length); i++) {
      const existing = await EnsModule.findOne({
        where: {
          id_enseignant: enseignants[i].id_enseignant,
          id_module: modules[i].id_module
        }
      });

      if (!existing) {
        await EnsModule.create({
          id_enseignant: enseignants[i].id_enseignant,
          id_module: modules[i].id_module
        });
        console.log(`✅ Association créée: Enseignant ${enseignants[i].id_enseignant} -> Module ${modules[i].id_module}`);
      } else {
        console.log(`⚠️ Association existe déjà: Enseignant ${enseignants[i].id_enseignant} -> Module ${modules[i].id_module}`);
      }
    }

    // Créer des programmes de test
    console.log('\n📋 Création des programmes de test...');
    const programmesToCreate = [
      {
        code_programme: 'PROG-001',
        titre_fr: 'Programme de Formation Web',
        titre_ar: 'برنامج تكوين الويب',
        status: 'مقبول',
        observation: 'Programme validé pour formation web',
        id_etab_regionale: etablissements[0].id_etab_regionale,
        id_module: modules[0].id_module
      },
      {
        code_programme: 'PROG-002',
        titre_fr: 'Programme de Formation Mobile',
        titre_ar: 'برنامج تكوين الجوال',
        status: 'في_الانتظار',
        observation: 'Programme en attente de validation',
        id_etab_regionale: etablissements[0].id_etab_regionale,
        id_module: modules[1]?.id_module || modules[0].id_module
      },
      {
        code_programme: 'PROG-003',
        titre_fr: 'Programme de Formation Base de Données',
        titre_ar: 'برنامج تكوين قواعد البيانات',
        status: 'مرفوض',
        observation: 'Programme refusé - contenu insuffisant',
        id_etab_regionale: etablissements[1]?.id_etab_regionale || etablissements[0].id_etab_regionale,
        id_module: modules[2]?.id_module || modules[0].id_module
      }
    ];

    for (const programmeData of programmesToCreate) {
      const existing = await Programme.findOne({
        where: { code_programme: programmeData.code_programme }
      });

      if (!existing) {
        const programme = await Programme.create(programmeData);
        console.log(`✅ Programme créé: ${programme.code_programme} - ${programme.titre_fr}`);
      } else {
        console.log(`⚠️ Programme existe déjà: ${programmeData.code_programme}`);
      }
    }

    // Vérifier les résultats
    console.log('\n🔍 Vérification des données créées...');
    const allProgrammes = await Programme.findAll({
      include: [
        {
          model: Module,
          as: 'module',
          attributes: ['designation_fr', 'code_module']
        },
        {
          model: EtablissementRegionale,
          as: 'etablissementRegionale',
          attributes: ['nom_fr']
        }
      ]
    });

    console.log(`✅ Total programmes dans la DB: ${allProgrammes.length}`);
    allProgrammes.forEach(p => {
      console.log(`- ${p.code_programme}: ${p.titre_fr} (${p.status})`);
    });

    console.log('\n🎉 Données de test créées avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

seedProgrammeData();

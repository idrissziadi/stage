const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');

async function seedProgrammeData() {
  try {
    console.log('🌱 Ajout de données de test pour les programmes...\n');

    // Vérifier si des modules existent
    const modules = await Module.findAll();
    if (modules.length === 0) {
      console.log('❌ Aucun module trouvé. Veuillez d\'abord ajouter des modules.');
      return;
    }

    // Vérifier si des établissements régionaux existent
    const etablissements = await EtablissementRegionale.findAll();
    if (etablissements.length === 0) {
      console.log('❌ Aucun établissement régional trouvé. Veuillez d\'abord ajouter des établissements.');
      return;
    }

    // Vérifier si des programmes existent déjà
    const existingProgrammes = await Programme.count();
    if (existingProgrammes > 0) {
      console.log(`✅ ${existingProgrammes} programmes existent déjà.`);
      return;
    }

    // Données de test
    const programmeData = [
      {
        code_programme: 'PROG-2024-001',
        titre_fr: 'Mathématiques Avancées',
        titre_ar: 'الرياضيات المتقدمة',
        status: 'في_الانتظار',
        id_module: modules[0].id_module,
        id_etab_regionale: etablissements[0].id_etab_regionale
      },
      {
        code_programme: 'PROG-2024-002',
        titre_fr: 'Physique Quantique',
        titre_ar: 'الفيزياء الكمية',
        status: 'مقبول',
        observation: 'Programme validé avec succès',
        id_module: modules[0].id_module,
        id_etab_regionale: etablissements[0].id_etab_regionale
      },
      {
        code_programme: 'PROG-2024-003',
        titre_fr: 'Informatique Appliquée',
        titre_ar: 'المعلوماتية التطبيقية',
        status: 'مرفوض',
        observation: 'Programme refusé - contenu insuffisant',
        id_module: modules[1] ? modules[1].id_module : modules[0].id_module,
        id_etab_regionale: etablissements[1] ? etablissements[1].id_etab_regionale : etablissements[0].id_etab_regionale
      },
      {
        code_programme: 'PROG-2024-004',
        titre_fr: 'Chimie Organique',
        titre_ar: 'الكيمياء العضوية',
        status: 'في_الانتظار',
        id_module: modules[1] ? modules[1].id_module : modules[0].id_module,
        id_etab_regionale: etablissements[1] ? etablissements[1].id_etab_regionale : etablissements[0].id_etab_regionale
      },
      {
        code_programme: 'PROG-2024-005',
        titre_fr: 'Biologie Moléculaire',
        titre_ar: 'البيولوجيا الجزيئية',
        status: 'مقبول',
        observation: 'Excellent programme pédagogique',
        id_module: modules[2] ? modules[2].id_module : modules[0].id_module,
        id_etab_regionale: etablissements[2] ? etablissements[2].id_etab_regionale : etablissements[0].id_etab_regionale
      }
    ];

    // Insérer les données
    const createdProgrammes = await Programme.bulkCreate(programmeData);

    console.log(`✅ ${createdProgrammes.length} programmes ajoutés avec succès !`);
    console.log('\n📊 Résumé des programmes créés :');
    
    createdProgrammes.forEach((programme, index) => {
      console.log(`${index + 1}. ${programme.code_programme} - ${programme.titre_fr} (${programme.status})`);
    });

    console.log('\n🎉 Données de test ajoutées avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
seedProgrammeData();

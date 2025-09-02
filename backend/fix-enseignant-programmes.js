const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const EnsModule = require('./models/Ens_Module');
const Enseignant = require('./models/Enseignant');
const { Op } = require('sequelize');

// Setup associations
require('./models/associations')();

async function fixEnseignantProgrammes() {
  console.log('🔧 Correction du problème البرامج للأساتذة...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // 1. Trouver des enseignants
    console.log('\n1. Recherche des enseignants...');
    const enseignants = await Enseignant.findAll({ limit: 3 });
    console.log(`Enseignants trouvés: ${enseignants.length}`);
    
    if (enseignants.length === 0) {
      console.log('❌ Aucun enseignant trouvé. Créons-en un...');
      
      // Créer un enseignant de test (nécessite un compte)
      const Compte = require('./models/Compte');
      const compte = await Compte.create({
        username: 'prof_test',
        password: 'test123', // À hasher en prod
        role: 'Enseignant'
      });
      
      const nouvelEnseignant = await Enseignant.create({
        nom_fr: 'Professeur Test',
        nom_ar: 'أستاذ اختبار',
        prenom_fr: 'Test',
        prenom_ar: 'اختبار',
        email: 'prof@test.com',
        compte_id: compte.id_compte
      });
      
      enseignants.push(nouvelEnseignant);
      console.log('✅ Enseignant de test créé');
    }

    // 2. Trouver/créer des modules
    console.log('\n2. Vérification des modules...');
    let modules = await Module.findAll({ limit: 3 });
    
    if (modules.length === 0) {
      console.log('⚠️ Aucun module trouvé. Créons-en quelques-uns...');
      
      // Créer quelques modules de test
      const Specialite = require('./models/Specialite');
      let specialite = await Specialite.findOne();
      
      if (!specialite) {
        console.log('Création d\'une spécialité de test...');
        const Branche = require('./models/Branche');
        let branche = await Branche.findOne();
        
        if (!branche) {
          const etabRegionale = await EtablissementRegionale.findOne();
          if (etabRegionale) {
            branche = await Branche.create({
              nom_fr: 'Informatique',
              nom_ar: 'الإعلاميات', 
              id_etab_regionale: etabRegionale.id_etab_regionale
            });
          }
        }
        
        if (branche) {
          specialite = await Specialite.create({
            nom_fr: 'Développement Web',
            nom_ar: 'تطوير الويب',
            id_branche: branche.id_branche
          });
        }
      }
      
      if (specialite) {
        const modulesToCreate = [
          { designation_fr: 'HTML/CSS', designation_ar: 'HTML/CSS', code_module: 'WEB01' },
          { designation_fr: 'JavaScript', designation_ar: 'جافا سكريبت', code_module: 'WEB02' },
          { designation_fr: 'React', designation_ar: 'رياكت', code_module: 'WEB03' }
        ];
        
        for (const moduleData of modulesToCreate) {
          const module = await Module.create({
            ...moduleData,
            id_specialite: specialite.id_specialite
          });
          modules.push(module);
          console.log(`✅ Module créé: ${module.designation_fr}`);
        }
      }
    }

    // 3. Créer associations enseignant-module
    console.log('\n3. Création des associations enseignant-module...');
    for (const enseignant of enseignants) {
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
          console.log(`✅ Association: ${enseignant.nom_fr} -> ${module.designation_fr}`);
        }
      }
    }

    // 4. Trouver/créer établissement régional
    let etablissement = await EtablissementRegionale.findOne();
    if (!etablissement) {
      console.log('\n⚠️ Création d\'un établissement régional de test...');
      const Compte = require('./models/Compte');
      const compteEtab = await Compte.create({
        username: 'etab_reg_test',
        password: 'test123',
        role: 'EtablissementRegionale'
      });
      
      etablissement = await EtablissementRegionale.create({
        nom_fr: 'Institut Régional Test',
        nom_ar: 'المعهد الجهوي للاختبار',
        adresse_fr: '123 Rue Test',
        adresse_ar: '123 شارع الاختبار',
        compte_id: compteEtab.id_compte
      });
      console.log('✅ Établissement régional créé');
    }

    // 5. Créer des programmes validés
    console.log('\n4. Création de programmes validés...');
    for (const module of modules) {
      const programmesToCreate = [
        {
          code_programme: `VALID-${module.code_module}-001`,
          titre_fr: `Formation Avancée ${module.designation_fr}`,
          titre_ar: `التكوين المتقدم في ${module.designation_ar}`,
          status: 'مقبول',
          observation: 'Programme validé - excellent contenu pédagogique',
          id_etab_regionale: etablissement.id_etab_regionale,
          id_module: module.id_module
        },
        {
          code_programme: `VALID-${module.code_module}-002`,
          titre_fr: `Pratiques Professionnelles ${module.designation_fr}`,
          titre_ar: `الممارسات المهنية في ${module.designation_ar}`,
          status: 'مقبول',
          observation: 'Programme validé - très pratique et utile',
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
          console.log(`✅ Programme validé créé: ${programme.code_programme}`);
        } else {
          console.log(`⚠️ Programme existe: ${programmeData.code_programme}`);
        }
      }
    }

    // 6. Test final - vérifier les résultats
    console.log('\n5. Test final...');
    for (const enseignant of enseignants) {
      console.log(`\n🔍 Test pour ${enseignant.nom_fr} (ID: ${enseignant.id_enseignant})`);
      
      // Récupérer les modules de l'enseignant
      const modulesEnseignes = await EnsModule.findAll({
        where: { id_enseignant: enseignant.id_enseignant },
        attributes: ['id_module']
      });
      
      const moduleIds = modulesEnseignes.map(em => em.id_module);
      console.log(`Modules enseignés: [${moduleIds.join(', ')}]`);
      
      // Récupérer les programmes validés
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
          },
          {
            model: EtablissementRegionale,
            as: 'etablissementRegionale',
            attributes: ['nom_fr']
          }
        ]
      });
      
      console.log(`✅ Programmes validés trouvés: ${programmesValides.length}`);
      programmesValides.forEach(p => {
        console.log(`  - ${p.code_programme}: ${p.titre_fr}`);
      });
    }

    console.log('\n🎉 Correction terminée !');
    console.log('\n📱 Testez maintenant :');
    console.log('1. Connectez-vous comme enseignant');
    console.log('2. Allez dans l\'onglet "البرامج"');
    console.log('3. Les programmes validés devraient apparaître');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

fixEnseignantProgrammes();

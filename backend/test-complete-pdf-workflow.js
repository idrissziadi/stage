const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');
const Module = require('./models/Module');
const EtablissementRegionale = require('./models/EtablissementRegionale');

// Setup associations
require('./models/associations')();

async function testCompletePDFWorkflow() {
  console.log('🧪 Test complet du workflow PDF des programmes...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // 1. Vérifier les programmes avec PDF
    console.log('\n1. Programmes avec fichiers PDF:');
    const programmesWithPDF = await Programme.findAll({
      where: {
        fichierpdf: { [require('sequelize').Op.ne]: null }
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
      limit: 3
    });

    if (programmesWithPDF.length === 0) {
      console.log('❌ Aucun programme avec PDF trouvé');
      console.log('💡 Exécutez: node add-pdf-to-programmes.js');
      return;
    }

    programmesWithPDF.forEach((p, index) => {
      console.log(`${index + 1}. ${p.code_programme}`);
      console.log(`   Fichier: ${p.fichierpdf}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Module: ${p.module?.designation_fr}`);
      console.log(`   URL: http://localhost:3000/programme/pdf/${p.fichierpdf}`);
      console.log('');
    });

    // 2. Statistiques des fichiers
    console.log('📊 Statistiques:');
    const totalProgrammes = await Programme.count();
    const programmesAvecPDF = await Programme.count({
      where: {
        fichierpdf: { [require('sequelize').Op.ne]: null }
      }
    });
    
    console.log(`- Total programmes: ${totalProgrammes}`);
    console.log(`- Avec PDF: ${programmesAvecPDF}`);
    console.log(`- Sans PDF: ${totalProgrammes - programmesAvecPDF}`);

    // 3. Par statut avec PDF
    console.log('\n📋 Programmes par statut (avec PDF):');
    const statuts = ['في_الانتظار', 'مقبول', 'مرفوض'];
    
    for (const statut of statuts) {
      const count = await Programme.count({
        where: {
          status: statut,
          fichierpdf: { [require('sequelize').Op.ne]: null }
        }
      });
      console.log(`- ${statut}: ${count} programmes`);
    }

    console.log('\n🎯 Tests à effectuer dans l\'interface:');
    console.log('\n👤 Établissement Régional:');
    console.log('1. Créer un nouveau programme avec upload PDF');
    console.log('2. Visualiser les programmes existants avec PDF');
    console.log('3. Modifier un programme et changer le PDF');

    console.log('\n👤 Établissement National:');
    console.log('1. Voir les programmes en attente avec PDF');
    console.log('2. Visualiser les PDF pendant la validation');
    console.log('3. Valider/Refuser avec le PDF consulté');

    console.log('\n👤 Enseignant:');
    console.log('1. Consulter les programmes validés avec PDF');
    console.log('2. Télécharger les PDF pour étude');
    console.log('3. Filtrer par module et voir les PDF');

    console.log('\n🔗 URLs de test (avec authentification):');
    programmesWithPDF.slice(0, 2).forEach(p => {
      console.log(`http://localhost:3000/programme/pdf/${p.fichierpdf}?token=VOTRE_TOKEN`);
    });

    console.log('\n🎉 Le système PDF est prêt à être testé !');
    console.log('\n📝 Pour tester complètement:');
    console.log('1. Démarrez le backend: npm start');
    console.log('2. Démarrez le frontend: npm run dev');
    console.log('3. Connectez-vous avec différents rôles');
    console.log('4. Testez l\'upload, visualisation, téléchargement');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

testCompletePDFWorkflow();

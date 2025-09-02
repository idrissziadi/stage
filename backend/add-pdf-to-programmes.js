const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');

// Setup associations
require('./models/associations')();

async function addPdfToProgrammes() {
  console.log('📄 Ajout de fichiers PDF aux programmes...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Récupérer quelques programmes
    const programmes = await Programme.findAll({ limit: 5 });
    console.log(`📋 Trouvé ${programmes.length} programmes`);

    if (programmes.length === 0) {
      console.log('❌ Aucun programme trouvé');
      return;
    }

    // Fichiers PDF de test (on simule des noms de fichiers)
    const testPdfFiles = [
      'programme-web-2024.pdf',
      'formation-sql-avancee.pdf',
      'cours-programmation-c.pdf',
      'module-developpement-mobile.pdf',
      'guide-base-donnees.pdf'
    ];

    // Mettre à jour les programmes avec des fichiers PDF
    for (let i = 0; i < programmes.length; i++) {
      const programme = programmes[i];
      const pdfFile = testPdfFiles[i] || `programme-${programme.id_programme}.pdf`;
      
      await programme.update({
        fichierpdf: pdfFile
      });
      
      console.log(`✅ PDF ajouté à ${programme.code_programme}: ${pdfFile}`);
    }

    // Vérifier les résultats
    console.log('\n🔍 Vérification des programmes avec PDF...');
    const programmesWithPdf = await Programme.findAll({
      where: {
        fichierpdf: { [require('sequelize').Op.ne]: null }
      }
    });

    console.log(`✅ ${programmesWithPdf.length} programmes ont maintenant des fichiers PDF`);
    programmesWithPdf.forEach(p => {
      console.log(`- ${p.code_programme}: ${p.fichierpdf}`);
    });

    console.log('\n🎉 Fichiers PDF ajoutés avec succès !');
    console.log('\n📱 Vous pouvez maintenant tester :');
    console.log('1. Connectez-vous en tant qu\'enseignant');
    console.log('2. Allez dans "البرامج"');
    console.log('3. Cliquez sur "عرض PDF" pour voir le viewer');
    console.log('');
    console.log('4. Connectez-vous en tant qu\'établissement nationale');
    console.log('5. Allez dans "إدارة البرامج"');
    console.log('6. Cliquez sur "عرض PDF" sur un programme');
    console.log('');
    console.log('7. Connectez-vous en tant qu\'établissement régionale');
    console.log('8. Allez dans "البرامج"');
    console.log('9. Cliquez sur l\'icône PDF pour voir le viewer');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

addPdfToProgrammes();

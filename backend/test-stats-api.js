const { sequelize } = require('./config/database');
const Programme = require('./models/Programme');

// Setup associations
require('./models/associations')();

async function testStatsAPI() {
  console.log('🧪 Test de l\'API stats des programmes...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // Simuler la logique de l'API stats
    console.log('\n1. Récupération des stats brutes...');
    const stats = await Programme.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']
      ],
      group: 'status'
    });

    console.log('Stats brutes:');
    stats.forEach(stat => {
      console.log(`- ${stat.status}: ${stat.dataValues.count}`);
    });

    // Formater comme dans le contrôleur
    console.log('\n2. Formatage des stats...');
    const formattedStats = {
      total: 0,
      parStatut: {
        'في_الانتظار': 0,
        'مقبول': 0,
        'مرفوض': 0
      }
    };

    stats.forEach(stat => {
      const count = parseInt(stat.dataValues.count);
      formattedStats.total += count;
      
      // Utiliser directement les status en arabe
      if (formattedStats.parStatut.hasOwnProperty(stat.status)) {
        formattedStats.parStatut[stat.status] = count;
      }
    });

    console.log('Stats formatées:');
    console.log(JSON.stringify(formattedStats, null, 2));

    // Test des activités récentes
    console.log('\n3. Test activités récentes...');
    const recentActivities = await Programme.findAll({
      attributes: ['id_programme', 'code_programme', 'titre_fr', 'status', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      limit: 5
    });

    console.log('Activités récentes:');
    recentActivities.forEach((activity, index) => {
      console.log(`${index + 1}. ID: ${activity.id_programme}, Code: ${activity.code_programme}, Status: ${activity.status}`);
    });

    console.log('\n🎯 Structure attendue par le frontend:');
    console.log('- stats.parStatut["في_الانتظار"]');
    console.log('- stats.parStatut["مقبول"]');
    console.log('- stats.parStatut["مرفوض"]');
    console.log('- activities[].id_programme (pour la key)');

    console.log('\n✅ API prête pour le frontend !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

testStatsAPI();

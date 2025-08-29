const { sequelize } = require('./config/database');
const setupAssociations = require('./models/associations');

// Import all models
require('./models/Compte');
require('./models/Enseignant');
require('./models/Stagiaire');
require('./models/EtablissementFormation');
require('./models/Branche');
require('./models/Specialite');
require('./models/Module');
require('./models/Offre');
require('./models/Inscription');
require('./models/Diplome');
require('./models/Mode_Formation');

setupAssociations();

async function testInscriptionLoading() {
  try {
    console.log('Testing inscription loading...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const Inscription = require('./models/Inscription');
    const Offre = require('./models/Offre');
    const Stagiaire = require('./models/Stagiaire');

    // Test for stagiaire inscriptions
    console.log('Testing getInscriptionsByStagiaire...');
    const stagiaireInscriptions = await Inscription.findAll({
      where: { id_stagiaire: 1 },
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            {
              model: require('./models/Specialite'),
              as: 'specialite',
              attributes: ['designation_fr', 'designation_ar'],
              required: false
            },
            {
              model: require('./models/EtablissementFormation'),
              as: 'etablissementFormation',
              attributes: ['nom_fr', 'nom_ar'],
              required: false
            },
            {
              model: require('./models/Diplome'),
              as: 'diplome',
              attributes: ['designation_fr', 'designation_ar'],
              required: false
            }
          ],
          required: false
        }
      ],
      limit: 5
    });

    console.log(`✅ Found ${stagiaireInscriptions.length} stagiaire inscriptions`);

    // Test for establishment inscriptions
    console.log('Testing getInscriptionsByEtablissement...');
    const etablissementInscriptions = await Inscription.findAll({
      include: [
        {
          model: Offre,
          as: 'offre',
          where: { id_etab_formation: 1 },
          include: [
            {
              model: require('./models/Specialite'),
              as: 'specialite',
              attributes: ['designation_fr', 'designation_ar']
            },
            {
              model: require('./models/Diplome'),
              as: 'diplome',
              attributes: ['designation_fr', 'designation_ar']
            }
          ]
        },
        {
          model: Stagiaire,
          as: 'stagiaire',
          attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'email'],
          include: [
            {
              model: require('./models/Compte'),
              as: 'Compte',
              attributes: ['username']
            }
          ]
        }
      ],
      limit: 5
    });

    console.log(`✅ Found ${etablissementInscriptions.length} establishment inscriptions`);

    console.log('✅ All inscription tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

testInscriptionLoading();
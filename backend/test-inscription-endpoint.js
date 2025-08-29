const { sequelize } = require('./config/database');
const setupAssociations = require('./models/associations');

// Import all models
const Compte = require('./models/Compte');
const Enseignant = require('./models/Enseignant');
const Stagiaire = require('./models/Stagiaire');
const EtablissementFormation = require('./models/EtablissementFormation');
const Specialite = require('./models/Specialite');
const Offre = require('./models/Offre');
const Inscription = require('./models/Inscription');
const Diplome = require('./models/Diplome');

setupAssociations();

async function testInscriptionEndpoint() {
  try {
    console.log('Testing inscription endpoint logic...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Test 1: Check if we can get offers for an establishment
    console.log('\n1. Testing offers retrieval...');
    const offres = await Offre.findAll({
      where: { id_etab_formation: 1 },
      attributes: ['id_offre']
    });
    console.log(`✅ Found ${offres.length} offers for establishment 1`);
    
    if (offres.length === 0) {
      console.log('❌ No offers found - this will result in empty inscriptions');
      return;
    }

    const offreIds = offres.map(offre => offre.id_offre);
    console.log('Offer IDs:', offreIds);

    // Test 2: Check inscriptions for these offers
    console.log('\n2. Testing inscriptions retrieval...');
    const whereClause = { id_offre: { [require('sequelize').Op.in]: offreIds } };
    
    const includeClause = [
      {
        model: Offre,
        as: 'offre',
        attributes: ['id_offre', 'description', 'designation_fr', 'designation_ar'],
        include: [
          {
            model: Specialite,
            as: 'specialite',
            attributes: ['designation_fr', 'designation_ar'],
            required: false
          },
          {
            model: Diplome,
            as: 'diplome',
            attributes: ['designation_fr', 'designation_ar'],
            required: false
          }
        ],
        required: false
      },
      {
        model: Stagiaire,
        as: 'stagiaire',
        attributes: ['id_stagiaire', 'nom_fr', 'prenom_fr', 'nom_ar', 'prenom_ar', 'email'],
        include: [
          {
            model: Compte,
            as: 'Compte',
            attributes: ['username'],
            required: false
          }
        ],
        required: false
      }
    ];

    const inscriptions = await Inscription.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: 5,
      offset: 0,
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${inscriptions.count} inscriptions`);
    
    if (inscriptions.rows.length > 0) {
      console.log('\n3. Sample inscription data:');
      const sample = inscriptions.rows[0];
      console.log('Inscription ID:', sample.id_inscription);
      console.log('Status:', sample.statut);
      console.log('Stagiaire name:', sample.stagiaire ? `${sample.stagiaire.prenom_fr} ${sample.stagiaire.nom_fr}` : 'NULL');
      console.log('Offre description:', sample.offre ? sample.offre.description : 'NULL');
      console.log('Offre designation_fr (virtual):', sample.offre ? sample.offre.designation_fr : 'NULL');
      if (sample.offre && sample.offre.specialite) {
        console.log('Specialite:', sample.offre.specialite.designation_fr);
      }
      if (sample.offre && sample.offre.diplome) {
        console.log('Diplome:', sample.offre.diplome.designation_fr);
      }
    }

    console.log('\n✅ All inscription tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

testInscriptionEndpoint();
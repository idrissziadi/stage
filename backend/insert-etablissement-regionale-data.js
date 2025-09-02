const { sequelize } = require('./config/database');
const Compte = require('./models/Compte');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const bcrypt = require('bcrypt');

async function insertEtablissementRegionale() {
  try {
    console.log('🚀 Début de l\'insertion des données pour l\'établissement régional...');
    
    // 1. Créer ou récupérer le compte
    let compte = await Compte.findOne({ where: { username: 'IFEP-SETIF' } });
    
    if (!compte) {
      console.log('📝 Création du compte...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      compte = await Compte.create({
        username: 'IFEP-SETIF',
        password: hashedPassword,
        role: 'EtablissementRegionale'
      });
      console.log('✅ Compte créé avec l\'ID:', compte.id_compte);
    } else {
      console.log('✅ Compte existant trouvé avec l\'ID:', compte.id_compte);
    }
    
    // 2. Vérifier si l'établissement existe déjà
    let etabRegionale = await EtablissementRegionale.findOne({ 
      where: { compte_id: compte.id_compte } 
    });
    
    if (etabRegionale) {
      console.log('📝 Mise à jour de l\'établissement existant...');
      await etabRegionale.update({
        code: 'IFEP-SETIF-001',
        code_regionale: 'SETIF-REGION',
        nom_fr: 'Institut de Formation et d\'Enseignement Professionnels de Sétif',
        nom_ar: 'معهد التكوين و التعليم المهنيين سطيف',
        adresse_fr: '123 Rue de la Formation, Sétif 19000, Algérie',
        adresse_ar: '١٢٣ شارع التكوين، سطيف ١٩٠٠٠، الجزائر',
        email: 'ifepsetif-at@mfep.gov.dz',
        telephone: '036621190'
      });
      console.log('✅ Établissement mis à jour');
    } else {
      console.log('📝 Création de l\'établissement...');
      etabRegionale = await EtablissementRegionale.create({
        code: 'IFEP-SETIF-001',
        code_regionale: 'SETIF-REGION',
        nom_fr: 'Institut de Formation et d\'Enseignement Professionnels de Sétif',
        nom_ar: 'معهد التكوين و التعليم المهنيين سطيف',
        adresse_fr: '123 Rue de la Formation, Sétif 19000, Algérie',
        adresse_ar: '١٢٣ شارع التكوين، سطيف ١٩٠٠٠، الجزائر',
        email: 'ifepsetif-at@mfep.gov.dz',
        telephone: '036621190',
        compte_id: compte.id_compte
      });
      console.log('✅ Établissement créé avec l\'ID:', etabRegionale.id_etab_regionale);
    }
    
    // 3. Vérifier les données insérées
    const etabVerif = await EtablissementRegionale.findOne({
      where: { compte_id: compte.id_compte },
      include: [{ model: Compte, as: 'Compte' }]
    });
    
    console.log('🔍 Données vérifiées:');
    console.log('Code:', etabVerif.code);
    console.log('Code Regionale:', etabVerif.code_regionale);
    console.log('Nom FR:', etabVerif.nom_fr);
    console.log('Nom AR:', etabVerif.nom_ar);
    console.log('Adresse FR:', etabVerif.adresse_fr);
    console.log('Adresse AR:', etabVerif.adresse_ar);
    console.log('Email:', etabVerif.email);
    console.log('Téléphone:', etabVerif.telephone);
    console.log('Compte ID:', etabVerif.compte_id);
    
    console.log('✅ Insertion terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
insertEtablissementRegionale();

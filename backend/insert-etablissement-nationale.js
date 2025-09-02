const { sequelize } = require('./config/database');
const Compte = require('./models/Compte');
const EtablissementNationale = require('./models/EtablissementNationale');
const bcrypt = require('bcrypt');

async function insertEtablissementNationale() {
  try {
    console.log('🚀 Début de l\'insertion des données...');
    
    // 1. Créer ou récupérer le compte
    let compte = await Compte.findOne({ where: { username: 'etab_nat1' } });
    
    if (!compte) {
      console.log('📝 Création du compte...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      compte = await Compte.create({
        username: 'etab_nat1',
        password: hashedPassword,
        role: 'EtablissementNationale'
      });
      console.log('✅ Compte créé avec l\'ID:', compte.id_compte);
    } else {
      console.log('✅ Compte existant trouvé avec l\'ID:', compte.id_compte);
    }
    
    // 2. Vérifier si l'établissement existe déjà
    let etabNationale = await EtablissementNationale.findOne({ 
      where: { compte_id: compte.id_compte } 
    });
    
    if (etabNationale) {
      console.log('📝 Mise à jour de l\'établissement existant...');
      await etabNationale.update({
        code: 'INSFP-ELBIAR-001',
        nom_fr: 'Institut National Spécialisé de la Formation Professionnelle El Biar',
        nom_ar: 'المعهد الوطني المتخصص في التكوين المهني الأبيار',
        adresse_fr: '123 Rue de la Formation, El Biar, Alger 16000, Algérie',
        adresse_ar: '١٢٣ شارع التكوين، الأبيار، الجزائر العاصمة ١٦٠٠٠، الجزائر',
        email: 'contact@insfp-elbiar.dz',
        telephone: '+213 21 23 45 67'
      });
      console.log('✅ Établissement mis à jour');
    } else {
      console.log('📝 Création de l\'établissement...');
      etabNationale = await EtablissementNationale.create({
        code: 'INSFP-ELBIAR-001',
        nom_fr: 'Institut National Spécialisé de la Formation Professionnelle El Biar',
        nom_ar: 'المعهد الوطني المتخصص في التكوين المهني الأبيار',
        adresse_fr: '123 Rue de la Formation, El Biar, Alger 16000, Algérie',
        adresse_ar: '١٢٣ شارع التكوين، الأبيار، الجزائر العاصمة ١٦٠٠٠، الجزائر',
        email: 'contact@insfp-elbiar.dz',
        telephone: '+213 21 23 45 67',
        compte_id: compte.id_compte
      });
      console.log('✅ Établissement créé avec l\'ID:', etabNationale.id_etab_nationale);
    }
    
    // 3. Vérifier les données insérées
    const etabVerif = await EtablissementNationale.findOne({
      where: { compte_id: compte.id_compte },
      include: [{ model: Compte, as: 'Compte' }]
    });
    
    console.log('🔍 Données vérifiées:');
    console.log('Code:', etabVerif.code);
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
insertEtablissementNationale();

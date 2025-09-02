const { sequelize } = require('./config/database');
const Cours = require('./models/Cours');
const Enseignant = require('./models/Enseignant');
const EtablissementFormation = require('./models/EtablissementFormation');
const EtablissementRegionale = require('./models/EtablissementRegionale');
const Compte = require('./models/Compte');

async function insertTestData() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie.');

    // Vérifier si le compte existe déjà
    let compte = await Compte.findOne({
      where: { username: 'etab_reg_test' }
    });

    if (!compte) {
      // Créer un compte de test pour l'établissement régional
      compte = await Compte.create({
        username: 'etab_reg_test',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'EtablissementRegionale'
      });
    }

    // Vérifier si l'établissement régional existe déjà
    let etabRegionale = await EtablissementRegionale.findOne({
      where: { compte_id: compte.id_compte }
    });

    if (!etabRegionale) {
      // Créer un établissement régional de test
      etabRegionale = await EtablissementRegionale.create({
        code: `ER${Date.now()}`,
        nom_fr: 'Établissement Régional Test',
        nom_ar: 'المؤسسة الجهوية التجريبية',
        adresse_fr: '123 Rue Test, Ville Test',
        adresse_ar: '123 شارع التجربة، مدينة التجربة',
        email: 'etab.reg.test@example.com',
        telephone: '+212123456789',
        compte_id: compte.id_compte
      });
    }

    // Créer un compte de test pour l'établissement de formation
    let compteEtabFormation = await Compte.findOne({
      where: { username: 'etab_formation_test' }
    });

    if (!compteEtabFormation) {
      compteEtabFormation = await Compte.create({
        username: 'etab_formation_test',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'EtablissementFormation'
      });
    }

    // Vérifier si l'établissement de formation existe déjà
    let etabFormation = await EtablissementFormation.findOne({
      where: { code: 'EF001' }
    });

    if (!etabFormation) {
      // Créer un établissement de formation de test
      etabFormation = await EtablissementFormation.create({
        code: 'EF001',
        nom_fr: 'Établissement Formation Test',
        nom_ar: 'مؤسسة التكوين التجريبية',
        adresse_fr: '456 Rue Formation, Ville Formation',
        adresse_ar: '456 شارع التكوين، مدينة التكوين',
        email: 'etab.formation.test@example.com',
        telephone: '+212987654321',
        statut: 'actif',
        compte_id: compteEtabFormation.id_compte
      });
    }

    // Vérifier si l'enseignant existe déjà
    let enseignant = await Enseignant.findOne({
      where: { email: 'jean.dupont@example.com' }
    });

    if (!enseignant) {
      // Créer un enseignant de test
      enseignant = await Enseignant.create({
        nom_fr: 'Dupont',
        nom_ar: 'دوبون',
        prenom_fr: 'Jean',
        prenom_ar: 'جان',
        email: 'jean.dupont@example.com',
        telephone: '+212555123456',
        grade: 'Maître Assistant',
        specialite: 'Informatique',
        id_etab_formation: etabFormation.id_etab_formation,
        statut: 'actif'
      });
    }

    // Créer des cours de test avec différents statuts
    const coursData = [
      {
        titre_fr: 'Introduction à la programmation',
        titre_ar: 'مقدمة في البرمجة',
        description_fr: 'Cours d\'introduction à la programmation',
        description_ar: 'درس مقدمة في البرمجة',
        contenu_fr: 'Contenu du cours de programmation',
        contenu_ar: 'محتوى درس البرمجة',
        duree_heures: 20,
        niveau: 'Débutant',
        id_enseignant: enseignant.id_enseignant,
        status: 'في_الانتظار',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 jours ago
      },
      {
        titre_fr: 'Bases de données',
        titre_ar: 'قواعد البيانات',
        description_fr: 'Cours sur les bases de données',
        description_ar: 'درس حول قواعد البيانات',
        contenu_fr: 'Contenu du cours de bases de données',
        contenu_ar: 'محتوى درس قواعد البيانات',
        duree_heures: 30,
        niveau: 'Intermédiaire',
        id_enseignant: enseignant.id_enseignant,
        status: 'مقبول',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 jours ago
      },
      {
        titre_fr: 'Développement web',
        titre_ar: 'تطوير الويب',
        description_fr: 'Cours de développement web',
        description_ar: 'درس تطوير الويب',
        contenu_fr: 'Contenu du cours de développement web',
        contenu_ar: 'محتوى درس تطوير الويب',
        duree_heures: 40,
        niveau: 'Avancé',
        id_enseignant: enseignant.id_enseignant,
        status: 'مرفوض',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 jours ago
      },
      {
        titre_fr: 'Intelligence artificielle',
        titre_ar: 'الذكاء الاصطناعي',
        description_fr: 'Cours d\'intelligence artificielle',
        description_ar: 'درس الذكاء الاصطناعي',
        contenu_fr: 'Contenu du cours d\'IA',
        contenu_ar: 'محتوى درس الذكاء الاصطناعي',
        duree_heures: 50,
        niveau: 'Expert',
        id_enseignant: enseignant.id_enseignant,
        status: 'مقبول',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 jours ago
      },
      {
        titre_fr: 'Sécurité informatique',
        titre_ar: 'أمن المعلومات',
        description_fr: 'Cours de sécurité informatique',
        description_ar: 'درس أمن المعلومات',
        contenu_fr: 'Contenu du cours de sécurité',
        contenu_ar: 'محتوى درس الأمن',
        duree_heures: 25,
        niveau: 'Intermédiaire',
        id_enseignant: enseignant.id_enseignant,
        status: 'في_الانتظار',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 jour ago
      }
    ];

    // Créer des cours de test seulement s'ils n'existent pas déjà
    for (const cours of coursData) {
      const existingCours = await Cours.findOne({
        where: { 
          titre_fr: cours.titre_fr,
          id_enseignant: enseignant.id_enseignant
        }
      });
      
      if (!existingCours) {
        await Cours.create(cours);
      }
    }

    console.log('Données de test insérées avec succès !');
    console.log('Compte créé avec:');
    console.log('- Nom d\'utilisateur: etab_reg_test');
    console.log('- Mot de passe: password');
    console.log('- Rôle: EtablissementRegionale');

  } catch (error) {
    console.error('Erreur lors de l\'insertion des données de test:', error);
  } finally {
    await sequelize.close();
  }
}

insertTestData();

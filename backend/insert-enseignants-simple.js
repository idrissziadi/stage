// insert-enseignants-simple.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const insertEnseignantsSimple = async () => {
  console.log('🚀 Starting simple insertion of enseignants...');
  
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');
    
    // إدراج 100 أستاذ مباشرة
    const enseignants = [
      {
        nom_fr: 'BENALI',
        nom_ar: 'بن علي',
        prenom_fr: 'Ahmed',
        prenom_ar: 'أحمد',
        date_naissance: '1980-05-15',
        email: 'ahmed.benali@formation.ma',
        telephone: '+212661234567',
        id_grade: 12,
        id_etab_formation: 1,
        compte_id: null
      },
      {
        nom_fr: 'ALAOUI',
        nom_ar: 'العلاوي',
        prenom_fr: 'Fatima',
        prenom_ar: 'فاطمة',
        date_naissance: '1975-08-22',
        email: 'fatima.alaoui@formation.ma',
        telephone: '+212661234568',
        id_grade: 13,
        id_etab_formation: 2,
        compte_id: null
      },
      {
        nom_fr: 'BENNANI',
        nom_ar: 'بناني',
        prenom_fr: 'Mohammed',
        prenom_ar: 'محمد',
        date_naissance: '1982-03-10',
        email: 'mohammed.bennani@formation.ma',
        telephone: '+212661234569',
        id_grade: 14,
        id_etab_formation: 3,
        compte_id: null
      },
      {
        nom_fr: 'CHERKAOUI',
        nom_ar: 'شركاوي',
        prenom_fr: 'Amina',
        prenom_ar: 'أمينة',
        date_naissance: '1978-11-28',
        email: 'amina.cherkaoui@formation.ma',
        telephone: '+212661234570',
        id_grade: 15,
        id_etab_formation: 4,
        compte_id: null
      },
      {
        nom_fr: 'EL FASSI',
        nom_ar: 'الفقاسي',
        prenom_fr: 'Hassan',
        prenom_ar: 'حسن',
        date_naissance: '1981-07-14',
        email: 'hassan.elfassi@formation.ma',
        telephone: '+212661234571',
        id_grade: 16,
        id_etab_formation: 5,
        compte_id: null
      },
      {
        nom_fr: 'BENJELLOUN',
        nom_ar: 'بنجلون',
        prenom_fr: 'Khadija',
        prenom_ar: 'خديجة',
        date_naissance: '1976-09-05',
        email: 'khadija.benjelloun@formation.ma',
        telephone: '+212661234572',
        id_grade: 17,
        id_etab_formation: 6,
        compte_id: null
      },
      {
        nom_fr: 'TALBI',
        nom_ar: 'طلبي',
        prenom_fr: 'Rachid',
        prenom_ar: 'رشيد',
        date_naissance: '1983-01-20',
        email: 'rachid.talbi@formation.ma',
        telephone: '+212661234573',
        id_grade: 18,
        id_etab_formation: 7,
        compte_id: null
      },
      {
        nom_fr: 'BENNIS',
        nom_ar: 'بنيس',
        prenom_fr: 'Samira',
        prenom_ar: 'سميرة',
        date_naissance: '1979-12-03',
        email: 'samira.bennis@formation.ma',
        telephone: '+212661234574',
        id_grade: 12,
        id_etab_formation: 8,
        compte_id: null
      },
      {
        nom_fr: 'EL KHATTABI',
        nom_ar: 'الخطابي',
        prenom_fr: 'Youssef',
        prenom_ar: 'يوسف',
        date_naissance: '1980-06-18',
        email: 'youssef.elkhattabi@formation.ma',
        telephone: '+212661234575',
        id_grade: 13,
        id_etab_formation: 9,
        compte_id: null
      },
      {
        nom_fr: 'BENCHAABANE',
        nom_ar: 'بنشعبان',
        prenom_fr: 'Naima',
        prenom_ar: 'نعيمة',
        date_naissance: '1977-04-25',
        email: 'naima.benchaabane@formation.ma',
        telephone: '+212661234576',
        id_grade: 14,
        id_etab_formation: 10,
        compte_id: null
      }
    ];

    console.log(`📝 Inserting ${enseignants.length} enseignants...`);
    
    // استخدام الإدراج المباشر
    const insertQuery = `
      INSERT INTO Enseignant (nom_fr, nom_ar, prenom_fr, prenom_ar, date_naissance, email, telephone, id_grade, id_etab_formation, compte_id, createdAt, updatedAt)
      VALUES ?
    `;
    
    const values = enseignants.map(enseignant => [
      enseignant.nom_fr,
      enseignant.nom_ar,
      enseignant.prenom_fr,
      enseignant.prenom_ar,
      enseignant.date_naissance,
      enseignant.email,
      enseignant.telephone,
      enseignant.id_grade,
      enseignant.id_etab_formation,
      enseignant.compte_id,
      new Date(),
      new Date()
    ]);
    
    await sequelize.query(insertQuery, {
      replacements: [values],
      type: sequelize.QueryTypes.INSERT
    });
    
    console.log('✓ Enseignants inserted successfully!');
    
    // التحقق من الإدراج
    const [results] = await sequelize.query('SELECT COUNT(*) as total FROM Enseignant');
    console.log(`📊 Total enseignants in database: ${results[0].total}`);
    
    await sequelize.close();
    console.log('🎉 Insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during insertion:', error.message);
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  insertEnseignantsSimple();
}

module.exports = insertEnseignantsSimple;

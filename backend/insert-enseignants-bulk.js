// insert-enseignants-bulk.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const insertEnseignantsBulk = async () => {
  console.log('🚀 Starting bulk insertion of enseignants...');
  
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');
    
    // إنشاء قائمة كبيرة من الأساتذة
    const noms = [
      { fr: 'BENALI', ar: 'بن علي' },
      { fr: 'ALAOUI', ar: 'العلاوي' },
      { fr: 'BENNANI', ar: 'بناني' },
      { fr: 'CHERKAOUI', ar: 'شركاوي' },
      { fr: 'EL FASSI', ar: 'الفقاسي' },
      { fr: 'BENJELLOUN', ar: 'بنجلون' },
      { fr: 'TALBI', ar: 'طلبي' },
      { fr: 'BENNIS', ar: 'بنيس' },
      { fr: 'EL KHATTABI', ar: 'الخطابي' },
      { fr: 'BENCHAABANE', ar: 'بنشعبان' },
      { fr: 'BENSLIMANE', ar: 'بن سليمان' },
      { fr: 'EL AMRANI', ar: 'الأميراني' },
      { fr: 'BENKIRANE', ar: 'بنكيران' },
      { fr: 'EL OUAZZANI', ar: 'الوزاني' },
      { fr: 'BENABDELAZIZ', ar: 'بن عبد العزيز' },
      { fr: 'BENNACER', ar: 'بن ناصر' },
      { fr: 'EL HASSANI', ar: 'الحسني' },
      { fr: 'BENCHIKH', ar: 'بن شيخ' },
      { fr: 'BENABDALLAH', ar: 'بن عبد الله' },
      { fr: 'EL MOUSSAOUI', ar: 'الموسوي' }
    ];
    
    const prenoms = [
      { fr: 'Ahmed', ar: 'أحمد' },
      { fr: 'Fatima', ar: 'فاطمة' },
      { fr: 'Mohammed', ar: 'محمد' },
      { fr: 'Amina', ar: 'أمينة' },
      { fr: 'Hassan', ar: 'حسن' },
      { fr: 'Khadija', ar: 'خديجة' },
      { fr: 'Rachid', ar: 'رشيد' },
      { fr: 'Samira', ar: 'سميرة' },
      { fr: 'Youssef', ar: 'يوسف' },
      { fr: 'Naima', ar: 'نعيمة' },
      { fr: 'Karim', ar: 'كريم' },
      { fr: 'Zineb', ar: 'زينب' },
      { fr: 'Abdelkader', ar: 'عبد القادر' },
      { fr: 'Latifa', ar: 'لطيفة' },
      { fr: 'Mustapha', ar: 'مصطفى' },
      { fr: 'Houda', ar: 'هودى' },
      { fr: 'Jamal', ar: 'جمال' },
      { fr: 'Sanaa', ar: 'سناء' },
      { fr: 'Adil', ar: 'عادل' },
      { fr: 'Malika', ar: 'مالكة' },
      { fr: 'Noureddine', ar: 'نور الدين' },
      { fr: 'Bouchra', ar: 'بشرى' },
      { fr: 'Hicham', ar: 'هشام' },
      { fr: 'Nadia', ar: 'نادية' },
      { fr: 'Omar', ar: 'عمر' },
      { fr: 'Souad', ar: 'سعاد' },
      { fr: 'Khalid', ar: 'خالد' },
      { fr: 'Fadwa', ar: 'فدوى' },
      { fr: 'Ibrahim', ar: 'إبراهيم' },
      { fr: 'Hayat', ar: 'حياة' },
      { fr: 'Younes', ar: 'يونس' },
      { fr: 'Sara', ar: 'سارة' },
      { fr: 'Ayman', ar: 'أيمن' },
      { fr: 'Layla', ar: 'ليلى' },
      { fr: 'Tariq', ar: 'طارق' },
      { fr: 'Rania', ar: 'رانيا' },
      { fr: 'Walid', ar: 'وليد' },
      { fr: 'Yasmin', ar: 'ياسمين' },
      { fr: 'Zakaria', ar: 'زكريا' },
      { fr: 'Nour', ar: 'نور' }
    ];
    
    const enseignants = [];
    let phoneCounter = 234567;
    
    // إنشاء 500 أستاذ
    for (let i = 0; i < 500; i++) {
      const nom = noms[i % noms.length];
      const prenom = prenoms[i % prenoms.length];
      const grade = 12 + (i % 7); // الدرجات من 12 إلى 18
      const etab = 1 + (i % 91); // المؤسسات من 1 إلى 91
      
      // تواريخ ميلاد عشوائية بين 1970 و 1990
      const year = 1970 + Math.floor(Math.random() * 20);
      const month = 1 + Math.floor(Math.random() * 12);
      const day = 1 + Math.floor(Math.random() * 28);
      
      enseignants.push({
        nom_fr: nom.fr,
        nom_ar: nom.ar,
        prenom_fr: prenom.fr,
        prenom_ar: prenom.ar,
        date_naissance: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        email: `${prenom.fr.toLowerCase()}.${nom.fr.toLowerCase()}${i}@formation.ma`,
        telephone: `+21266${phoneCounter + i}`,
        id_grade: grade,
        id_etab_formation: etab,
        compte_id: null
      });
    }
    
    console.log(`📝 Inserting ${enseignants.length} enseignants in batches...`);
    
    // إدراج البيانات في دفعات لتجنب مشاكل الذاكرة
    const batchSize = 50;
    let totalInserted = 0;
    
    for (let i = 0; i < enseignants.length; i += batchSize) {
      const batch = enseignants.slice(i, i + batchSize);
      
      try {
        await sequelize.query(`
          INSERT INTO Enseignant (nom_fr, nom_ar, prenom_fr, prenom_ar, date_naissance, email, telephone, id_grade, id_etab_formation, compte_id, createdAt, updatedAt)
          VALUES ${batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ')}
        `, {
          replacements: batch.flatMap(enseignant => [
            enseignant.nom_fr,
            enseignant.nom_ar,
            enseignant.prenom_fr,
            enseignant.prenom_ar,
            enseignant.date_naissance,
            enseignant.email,
            enseignant.telephone,
            enseignant.id_grade,
            enseignant.id_etab_formation,
            enseignant.compte_id
          ]),
          type: sequelize.QueryTypes.INSERT
        });
        
        totalInserted += batch.length;
        console.log(`✓ Inserted batch ${Math.ceil(i / batchSize) + 1}: ${totalInserted}/${enseignants.length} enseignants`);
        
      } catch (error) {
        console.error(`❌ Error inserting batch ${Math.ceil(i / batchSize) + 1}:`, error.message);
      }
    }
    
    // التحقق من الإدراج
    const [results] = await sequelize.query('SELECT COUNT(*) as total FROM Enseignant');
    console.log(`📊 Total enseignants in database: ${results[0].total}`);
    
    // إحصائيات التوزيع
    const [gradeStats] = await sequelize.query(`
      SELECT id_grade, COUNT(*) as count 
      FROM Enseignant 
      WHERE id_grade BETWEEN 12 AND 18
      GROUP BY id_grade 
      ORDER BY id_grade
    `);
    
    console.log('\n📈 Distribution by Grade:');
    gradeStats.forEach(stat => {
      console.log(`   Grade ${stat.id_grade}: ${stat.count} enseignants`);
    });
    
    const [etabStats] = await sequelize.query(`
      SELECT 
        CASE 
          WHEN id_etab_formation BETWEEN 1 AND 10 THEN '1-10'
          WHEN id_etab_formation BETWEEN 11 AND 20 THEN '11-20'
          WHEN id_etab_formation BETWEEN 21 AND 30 THEN '21-30'
          WHEN id_etab_formation BETWEEN 31 AND 40 THEN '31-40'
          WHEN id_etab_formation BETWEEN 41 AND 50 THEN '41-50'
          WHEN id_etab_formation BETWEEN 51 AND 60 THEN '51-60'
          WHEN id_etab_formation BETWEEN 61 AND 70 THEN '61-70'
          WHEN id_etab_formation BETWEEN 71 AND 80 THEN '71-80'
          WHEN id_etab_formation BETWEEN 81 AND 91 THEN '81-91'
        END as range_etab,
        COUNT(*) as count
      FROM Enseignant 
      WHERE id_etab_formation BETWEEN 1 AND 91
      GROUP BY range_etab
      ORDER BY range_etab
    `);
    
    console.log('\n📈 Distribution by Establishment Range:');
    etabStats.forEach(stat => {
      console.log(`   Establishments ${stat.range_etab}: ${stat.count} enseignants`);
    });
    
    await sequelize.close();
    console.log('\n🎉 Bulk insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during bulk insertion:', error.message);
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  insertEnseignantsBulk();
}

module.exports = insertEnseignantsBulk;

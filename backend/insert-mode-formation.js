// insert-mode-formation.js
require('dotenv').config();
const { sequelize } = require('./config/database');

const insertModeFormation = async () => {
  console.log('🚀 Starting insertion of formation modes...');
  
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');
    
    // أنماط التكوين المهني الأساسية
    const modesFormation = [
      {
        id: 1,
        code: 'FORMATION_INITIALE',
        designation_fr: 'Formation Initiale',
        designation_ar: 'التكوين الأولي',
        description: 'Formation pour les nouveaux apprenants sans expérience professionnelle'
      },
      {
        id: 2,
        code: 'FORMATION_CONTINUE',
        designation_fr: 'Formation Continue',
        designation_ar: 'التكوين المستمر',
        description: 'Formation pour les professionnels en activité souhaitant se perfectionner'
      },
      {
        id: 3,
        code: 'FORMATION_ALTERNANCE',
        designation_fr: 'Formation en Alternance',
        designation_ar: 'التكوين بالتناوب',
        description: 'Formation combinant théorie en centre et pratique en entreprise'
      },
      {
        id: 4,
        code: 'FORMATION_APPRENTISSAGE',
        designation_fr: 'Formation en Apprentissage',
        designation_ar: 'التكوين بالتعلم',
        description: 'Formation par apprentissage avec contrat de travail'
      },
      {
        id: 5,
        code: 'FORMATION_DISTANCE',
        designation_fr: 'Formation à Distance',
        designation_ar: 'التكوين عن بعد',
        description: 'Formation dispensée en ligne ou par correspondance'
      },
      {
        id: 6,
        code: 'FORMATION_INTENSIVE',
        designation_fr: 'Formation Intensive',
        designation_ar: 'التكوين المكثف',
        description: 'Formation accélérée sur une courte période'
      },
      {
        id: 7,
        code: 'FORMATION_MODULAIRE',
        designation_fr: 'Formation Modulaire',
        designation_ar: 'التكوين النمطي',
        description: 'Formation organisée en modules indépendants'
      },
      {
        id: 8,
        code: 'FORMATION_SUR_MESURE',
        designation_fr: 'Formation sur Mesure',
        designation_ar: 'التكوين حسب الطلب',
        description: 'Formation personnalisée selon les besoins spécifiques'
      }
    ];
    
    console.log(`📝 Inserting ${modesFormation.length} formation modes...`);
    
    let insertedCount = 0;
    
    for (const mode of modesFormation) {
      try {
        await sequelize.query(`
          INSERT IGNORE INTO mode_formation (id_mode, code_mode, designation_fr, designation_ar, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, NOW(), NOW())
        `, {
          replacements: [
            mode.id,
            mode.code,
            mode.designation_fr,
            mode.designation_ar
          ],
          type: sequelize.QueryTypes.INSERT
        });
        
        insertedCount++;
        console.log(`✓ Inserted: ${mode.designation_fr} (${mode.designation_ar})`);
        
      } catch (error) {
        if (error.message.includes('Duplicate entry')) {
          console.log(`⚠️ Mode ${mode.id} already exists: ${mode.designation_fr}`);
        } else {
          console.error(`❌ Error inserting mode ${mode.id}:`, error.message);
        }
      }
    }
    
    // التحقق من الإدراج
    console.log('\n🔍 Verifying insertion...');
    
    const [totalCount] = await sequelize.query('SELECT COUNT(*) as total FROM mode_formation');
    const [data] = await sequelize.query('SELECT * FROM mode_formation ORDER BY id_mode');
    
    console.log(`\n📊 Insertion Results:`);
    console.log(`✓ Total modes in database: ${totalCount[0].total}`);
    console.log(`✓ Newly inserted: ${insertedCount}`);
    
    console.log('\n📋 All Formation Modes:');
    console.table(data.map(mode => ({
      ID: mode.id_mode,
      Code: mode.code_mode,
      'Designation FR': mode.designation_fr,
      'Designation AR': mode.designation_ar
    })));
    
    await sequelize.close();
    console.log('\n🎉 Formation modes insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during insertion:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// تشغيل الإدراج إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  insertModeFormation();
}

module.exports = insertModeFormation;

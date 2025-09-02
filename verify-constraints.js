const { sequelize } = require('./backend/config/database');

async function verifyConstraints() {
  try {
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles après configuration des associations
    const Offre = sequelize.models.Offre;
    const Module = sequelize.models.Module;
    const Specialite = sequelize.models.Specialite;
    
    console.log('🔍 Vérification des contraintes avant peuplement de OffreModule...\n');
    
    // 1. Vérifier que toutes les offres ont une spécialité
    console.log('1️⃣ Vérification des offres sans spécialité...');
    const offresWithoutSpecialite = await Offre.findAll({
      include: [
        {
          model: Specialite,
          as: 'specialite',
          required: false
        }
      ],
      where: {
        '$specialite.id_specialite$': null
      }
    });
    
    if (offresWithoutSpecialite.length === 0) {
      console.log('   ✅ Toutes les offres ont une spécialité');
    } else {
      console.log(`   ⚠️  ${offresWithoutSpecialite.length} offres sans spécialité trouvées:`);
      offresWithoutSpecialite.forEach(offre => {
        console.log(`      - Offre ID: ${offre.id_offre}`);
      });
    }
    
    // 2. Vérifier que tous les modules ont une spécialité
    console.log('\n2️⃣ Vérification des modules sans spécialité...');
    const modulesWithoutSpecialite = await Module.findAll({
      where: {
        id_specialite: null
      }
    });
    
    if (modulesWithoutSpecialite.length === 0) {
      console.log('   ✅ Tous les modules ont une spécialité');
    } else {
      console.log(`   ⚠️  ${modulesWithoutSpecialite.length} modules sans spécialité trouvés:`);
      modulesWithoutSpecialite.forEach(module => {
        console.log(`      - Module ID: ${module.id_module}, Code: ${module.code_module}`);
      });
    }
    
    // 3. Vérifier la cohérence des données
    console.log('\n3️⃣ Vérification de la cohérence des données...');
    
    const offres = await Offre.findAll({
      include: [
        {
          model: Specialite,
          as: 'specialite',
          attributes: ['id_specialite', 'designation_fr', 'designation_ar']
        }
      ]
    });
    
    let totalOffres = 0;
    let totalModules = 0;
    let totalAssociations = 0;
    
    for (const offre of offres) {
      if (!offre.specialite) continue;
      
      totalOffres++;
      const modules = await Module.findAll({
        where: { id_specialite: offre.id_specialite },
        attributes: ['id_module', 'code_module', 'designation_fr']
      });
      
      totalModules += modules.length;
      totalAssociations += modules.length;
      
      console.log(`   Offre ${offre.id_offre} (${offre.specialite.designation_fr}): ${modules.length} modules`);
    }
    
    console.log(`\n📊 Résumé des associations à créer:`);
    console.log(`   Total offres: ${totalOffres}`);
    console.log(`   Total modules: ${totalModules}`);
    console.log(`   Total associations: ${totalAssociations}`);
    
    // 4. Vérifier les spécialités orphelines
    console.log('\n4️⃣ Vérification des spécialités orphelines...');
    const specialites = await Specialite.findAll({
      include: [
        {
          model: Offre,
          as: 'offres',
          required: false
        },
        {
          model: Module,
          as: 'modules',
          required: false
        }
      ]
    });
    
    const orphelines = specialites.filter(spec => 
      (!spec.offres || spec.offres.length === 0) && 
      (!spec.modules || spec.modules.length === 0)
    );
    
    if (orphelines.length === 0) {
      console.log('   ✅ Aucune spécialité orpheline trouvée');
    } else {
      console.log(`   ⚠️  ${orphelines.length} spécialités orphelines trouvées:`);
      orphelines.forEach(spec => {
        console.log(`      - ${spec.designation_fr} (ID: ${spec.id_specialite})`);
      });
    }
    
    // 5. Recommandations
    console.log('\n5️⃣ Recommandations:');
    if (offresWithoutSpecialite.length > 0) {
      console.log('   ❌ Corriger les offres sans spécialité avant de continuer');
    }
    if (modulesWithoutSpecialite.length > 0) {
      console.log('   ❌ Corriger les modules sans spécialité avant de continuer');
    }
    if (orphelines.length > 0) {
      console.log('   ⚠️  Considérer la suppression des spécialités orphelines');
    }
    
    if (offresWithoutSpecialite.length === 0 && modulesWithoutSpecialite.length === 0) {
      console.log('   ✅ Toutes les contraintes sont respectées, vous pouvez procéder au peuplement');
      console.log('   🚀 Exécutez: node populate-offre-module.js');
    } else {
      console.log('   ❌ Corrigez les problèmes ci-dessus avant de procéder au peuplement');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter la vérification
verifyConstraints();

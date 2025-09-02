const { sequelize } = require('./backend/config/database');

async function populateOffreModule() {
  try {
    // Importer et configurer les associations
    const setupAssociations = require('./backend/models/associations');
    setupAssociations();
    
    // Importer les modèles après configuration des associations
    const Offre = sequelize.models.Offre;
    const Module = sequelize.models.Module;
    const Specialite = sequelize.models.Specialite;
    const OffreModule = sequelize.models.OffreModule;
    
    console.log('🚀 Début du peuplement de la table OffreModule...');
    console.log('📋 Contrainte: Les modules d\'une offre doivent appartenir à la même spécialité que l\'offre\n');
    
    // Récupérer toutes les offres avec leurs spécialités
    const offres = await Offre.findAll({
      include: [
        {
          model: Specialite,
          as: 'specialite',
          attributes: ['id_specialite', 'designation_fr', 'designation_ar']
        }
      ]
    });
    
    console.log(`📊 Trouvé ${offres.length} offres`);
    
    let totalInserted = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let totalValidated = 0;
    
    for (const offre of offres) {
      console.log(`\n🔍 Traitement de l'offre ID: ${offre.id_offre}`);
      console.log(`   Spécialité: ${offre.specialite?.designation_fr || 'N/A'} (ID: ${offre.id_specialite})`);
      
      if (!offre.specialite) {
        console.log(`   ⚠️  Aucune spécialité trouvée pour cette offre, ignorée`);
        continue;
      }
      
      // Récupérer tous les modules de la spécialité de cette offre
      const modules = await Module.findAll({
        where: { id_specialite: offre.id_specialite },
        attributes: ['id_module', 'code_module', 'designation_fr', 'id_specialite']
      });
      
      console.log(`   Modules trouvés dans la spécialité: ${modules.length}`);
      
      // Validation supplémentaire de la cohérence
      const validModules = modules.filter(module => {
        const isValid = module.id_specialite === offre.id_specialite;
        if (!isValid) {
          console.log(`   ⚠️  Module ${module.code_module} a une spécialité différente (${module.id_specialite} vs ${offre.id_specialite})`);
        }
        return isValid;
      });
      
      if (validModules.length !== modules.length) {
        console.log(`   ⚠️  ${modules.length - validModules.length} modules incohérents filtrés`);
      }
      
      console.log(`   Modules valides après filtrage: ${validModules.length}`);
      
      for (const module of validModules) {
        try {
          // Vérifier si l'association existe déjà
          const existingAssociation = await OffreModule.findOne({
            where: {
              id_offre: offre.id_offre,
              id_module: module.id_module
            }
          });
          
          if (existingAssociation) {
            console.log(`   ⏭️  Association déjà existante: Offre ${offre.id_offre} - Module ${module.code_module}`);
            totalSkipped++;
            continue;
          }
          
          // Validation finale avant création
          if (module.id_specialite !== offre.id_specialite) {
            console.log(`   ❌ ERREUR: Incohérence détectée - Module ${module.code_module} (Spécialité: ${module.id_specialite}) vs Offre (Spécialité: ${offre.id_specialite})`);
            totalErrors++;
            continue;
          }
          
          // Créer l'association avec requête SQL directe
          await sequelize.query(`
            INSERT INTO OffreModule (id_offre, id_module) 
            VALUES (?, ?)
          `, {
            replacements: [offre.id_offre, module.id_module],
            type: sequelize.QueryTypes.INSERT
          });
          
          console.log(`   ✅ Créée: Offre ${offre.id_offre} - Module ${module.code_module} (Spécialité: ${module.id_specialite})`);
          totalInserted++;
          totalValidated++;
          
        } catch (error) {
          console.error(`   ❌ Erreur lors de la création de l'association Offre ${offre.id_offre} - Module ${module.code_module}:`, error.message);
          totalErrors++;
        }
      }
    }
    
    console.log(`\n🎉 Peuplement terminé !`);
    console.log(`   Total inséré: ${totalInserted}`);
    console.log(`   Total ignoré: ${totalSkipped}`);
    console.log(`   Total validé: ${totalValidated}`);
    console.log(`   Total erreurs: ${totalErrors}`);
    console.log(`   Total traité: ${totalInserted + totalSkipped + totalErrors}`);
    
    // Vérification finale de la cohérence
    console.log(`\n🔍 Vérification finale de la cohérence...`);
    const inconsistentAssociations = await sequelize.query(`
      SELECT om.id_offre, om.id_module, o.id_specialite as offre_specialite, m.id_specialite as module_specialite
      FROM OffreModule om
      JOIN Offre o ON om.id_offre = o.id_offre
      JOIN Module m ON om.id_module = m.id_module
      WHERE o.id_specialite != m.id_specialite
    `, { type: sequelize.QueryTypes.SELECT });
    
    if (inconsistentAssociations.length === 0) {
      console.log(`   ✅ Toutes les associations sont cohérentes !`);
    } else {
      console.log(`   ❌ ${inconsistentAssociations.length} associations incohérentes trouvées:`);
      inconsistentAssociations.forEach(inc => {
        console.log(`      Offre ${inc.id_offre} (Spécialité: ${inc.offre_specialite}) - Module ${inc.id_module} (Spécialité: ${inc.module_specialite})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
populateOffreModule();

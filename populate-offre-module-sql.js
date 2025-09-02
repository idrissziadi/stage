const { sequelize } = require('./backend/config/database');

async function populateOffreModuleSQL() {
  try {
    console.log('🚀 Début du peuplement de la table OffreModule avec SQL direct...');
    console.log('📋 Contrainte: Les modules d\'une offre doivent appartenir à la même spécialité que l\'offre\n');
    
    // 1. Récupérer toutes les offres avec leurs spécialités
    console.log('1️⃣ Récupération des offres et spécialités...');
    const offres = await sequelize.query(`
      SELECT o.id_offre, o.id_specialite, s.designation_fr as specialite_nom
      FROM Offre o
      JOIN Specialite s ON o.id_specialite = s.id_specialite
      ORDER BY o.id_offre
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log(`📊 Trouvé ${offres.length} offres`);
    
    let totalInserted = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    
    // 2. Pour chaque offre, récupérer les modules de sa spécialité
    for (const offre of offres) {
      console.log(`\n🔍 Traitement de l'offre ID: ${offre.id_offre}`);
      console.log(`   Spécialité: ${offre.specialite_nom} (ID: ${offre.id_specialite})`);
      
      // Récupérer les modules de cette spécialité
      const modules = await sequelize.query(`
        SELECT id_module, code_module, designation_fr
        FROM Module
        WHERE id_specialite = ?
        ORDER BY code_module
      `, {
        replacements: [offre.id_specialite],
        type: sequelize.QueryTypes.SELECT
      });
      
      console.log(`   Modules trouvés dans la spécialité: ${modules.length}`);
      
      // 3. Pour chaque module, créer l'association
      for (const module of modules) {
        try {
          // Vérifier si l'association existe déjà
          const existingAssociation = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM OffreModule
            WHERE id_offre = ? AND id_module = ?
          `, {
            replacements: [offre.id_offre, module.id_module],
            type: sequelize.QueryTypes.SELECT
          });
          
          if (existingAssociation[0].count > 0) {
            console.log(`   ⏭️  Association déjà existante: Offre ${offre.id_offre} - Module ${module.code_module}`);
            totalSkipped++;
            continue;
          }
          
          // Créer l'association
          await sequelize.query(`
            INSERT INTO OffreModule (id_offre, id_module)
            VALUES (?, ?)
          `, {
            replacements: [offre.id_offre, module.id_module],
            type: sequelize.QueryTypes.INSERT
          });
          
          console.log(`   ✅ Créée: Offre ${offre.id_offre} - Module ${module.code_module} (${module.designation_fr})`);
          totalInserted++;
          
        } catch (error) {
          console.error(`   ❌ Erreur lors de la création de l'association Offre ${offre.id_offre} - Module ${module.code_module}:`, error.message);
          totalErrors++;
        }
      }
    }
    
    console.log(`\n🎉 Peuplement terminé !`);
    console.log(`   Total inséré: ${totalInserted}`);
    console.log(`   Total ignoré: ${totalSkipped}`);
    console.log(`   Total erreurs: ${totalErrors}`);
    console.log(`   Total traité: ${totalInserted + totalSkipped + totalErrors}`);
    
    // 4. Vérification finale de la cohérence
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
    
    // 5. Statistiques finales
    console.log(`\n📊 Statistiques finales:`);
    const totalAssociations = await sequelize.query(`
      SELECT COUNT(*) as count FROM OffreModule
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log(`   Total associations dans la table: ${totalAssociations[0].count}`);
    
    if (totalInserted > 0) {
      console.log(`\n🎯 Résultat: ${totalInserted} associations créées avec succès !`);
      console.log(`   Les stagiaires verront maintenant uniquement les modules de leurs offres d'inscription.`);
    } else {
      console.log(`\n⚠️  Aucune association n'a été créée. Vérifiez les erreurs ci-dessus.`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
populateOffreModuleSQL();

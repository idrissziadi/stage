const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de l\'implémentation OffreModule...\n');

// Vérifier les fichiers créés
const filesToCheck = [
  'backend/models/OffreModule.js',
  'backend/controllers/CoursController.js',
  'populate-offre-module.js',
  'test-offre-module.js',
  'create-offre-module-table.sql',
  'GUIDE_OFFRE_MODULE.md',
  'verify-constraints.js',
  'start-offre-module-enhanced.bat',
  'start-offre-module-enhanced.ps1'
];

console.log('📁 Fichiers à vérifier:');
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MANQUANT`);
  }
});

// Vérifier les modifications dans les fichiers existants
console.log('\n🔧 Vérification des modifications:');

// Vérifier associations.js
const associationsPath = 'backend/models/associations.js';
if (fs.existsSync(associationsPath)) {
  const associationsContent = fs.readFileSync(associationsPath, 'utf8');
  if (associationsContent.includes('OffreModule')) {
    console.log('   ✅ associations.js - Associations OffreModule présentes');
  } else {
    console.log('   ❌ associations.js - Associations OffreModule manquantes');
  }
} else {
  console.log('   ❌ associations.js - Fichier non trouvé');
}

// Vérifier CoursController.js
const controllerPath = 'backend/controllers/CoursController.js';
if (fs.existsSync(controllerPath)) {
  const controllerContent = fs.readFileSync(controllerPath, 'utf8');
  if (controllerContent.includes('OffreModule')) {
    console.log('   ✅ CoursController.js - Utilisation d\'OffreModule présente');
  } else {
    console.log('   ❌ CoursController.js - Utilisation d\'OffreModule manquante');
  }
} else {
  console.log('   ❌ CoursController.js - Fichier non trouvé');
}

console.log('\n📋 Résumé des actions à effectuer:');
console.log('1. Vérifier les contraintes: node verify-constraints.js');
console.log('2. Créer la table OffreModule avec le script SQL');
console.log('3. Exécuter le script de peuplement: node populate-offre-module.js');
console.log('4. Tester la fonctionnalité: node test-offre-module.js');
console.log('5. Vérifier que les stagiaires voient uniquement les modules de leurs offres');

console.log('\n🎯 Prochaines étapes:');
console.log('- Utiliser les scripts améliorés: start-offre-module-enhanced.bat/.ps1');
console.log('- Vérifier les contraintes avant le peuplement');
console.log('- Tester l\'onglet "دروسي" pour un stagiaire');
console.log('- Consulter le guide GUIDE_OFFRE_MODULE.md pour plus de détails');

console.log('\n🚀 Scripts de démarrage disponibles:');
console.log('- start-offre-module-enhanced.bat (Windows)');
console.log('- start-offre-module-enhanced.ps1 (PowerShell)');
console.log('- start-offre-module.bat/.ps1 (version simple)');

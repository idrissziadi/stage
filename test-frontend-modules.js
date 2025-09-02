// Test de simulation de la réponse frontend
console.log('🧪 Test de simulation de la réponse frontend\n');

// Simuler la réponse de l'API (ce que l'API retourne réellement)
const modulesResponse = {
  data: [
    {
      id_module: 70,
      code_module: "VOIR-SIG-19",
      designation_fr: "Signalisation routière",
      designation_ar: "إشارات المرور",
      specialite: {
        id_specialite: 19,
        designation_fr: "Voirie et réseaux divers",
        designation_ar: "الطرقات والشبكات المتنوعة"
      },
      semestre: "S1",
      annee_scolaire: "2025-09-01",
      assigned_at: "2025-09-02T10:19:27.000Z"
    }
  ]
};

console.log('📡 Réponse API simulée:', modulesResponse);
console.log('📊 Type de response.data:', typeof modulesResponse.data);
console.log('📊 Est un tableau:', Array.isArray(modulesResponse.data));

// Simuler la logique du composant CoursManagement.tsx
let modulesData = [];

// L'API retourne { data: [...] } - traitement simplifié
if (modulesResponse && modulesResponse.data) {
  if (Array.isArray(modulesResponse.data)) {
    modulesData = modulesResponse.data;
    console.log('✅ Modules trouvés directement dans response.data:', modulesData.length);
  } else if (modulesResponse.data.modules_by_year) {
    // Fallback pour l'ancienne structure
    Object.values(modulesResponse.data.modules_by_year).forEach(yearModules => {
      if (Array.isArray(yearModules)) {
        modulesData = [...modulesData, ...yearModules];
      }
    });
    console.log('✅ Modules extraits de modules_by_year:', modulesData.length);
  }
} else if (Array.isArray(modulesResponse)) {
  // Fallback si la réponse est directement un tableau
  modulesData = modulesResponse;
  console.log('✅ Modules trouvés directement dans la réponse:', modulesData.length);
}

console.log('🎯 Processed modules data:', modulesData);
console.log('📊 Type de modulesData:', typeof modulesData);
console.log('📊 Est un tableau:', Array.isArray(modulesData));

// Ensure modules is always an array
if (Array.isArray(modulesData)) {
  console.log('✅ Modules définis avec succès:', modulesData.length);
  
  // Simuler l'affichage dans le select
  console.log('\n📋 Modules disponibles dans le select:');
  modulesData.forEach((module, index) => {
    console.log(`   ${index + 1}. ${module.designation_ar || module.designation_fr} (${module.code_module})`);
  });
} else {
  console.log('❌ Modules response is not an array:', modulesData);
}

console.log('\n🎯 Test terminé avec succès !');

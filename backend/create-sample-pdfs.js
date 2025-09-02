const fs = require('fs').promises;
const path = require('path');

async function createSamplePDFs() {
  console.log('📄 Création de fichiers PDF de test...\n');

  const uploadsDir = path.join(__dirname, 'upload', 'programmes');
  
  // Vérifier que le répertoire existe
  try {
    await fs.access(uploadsDir);
  } catch (error) {
    console.log('📁 Création du répertoire upload/programmes...');
    await fs.mkdir(uploadsDir, { recursive: true });
  }

  // Créer des fichiers PDF simples (header PDF minimal)
  const pdfHeader = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

5 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Programme de Formation) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000274 00000 n 
0000000361 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
456
%%EOF`;

  const sampleFiles = [
    'programme-web-2024.pdf',
    'formation-sql-avancee.pdf',
    'cours-programmation-c.pdf',
    'module-developpement-mobile.pdf',
    'guide-base-donnees.pdf'
  ];

  for (const filename of sampleFiles) {
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, pdfHeader);
    console.log(`✅ Créé: ${filename}`);
  }

  console.log('\n🎉 Fichiers PDF de test créés avec succès !');
  console.log('\n📱 Ces fichiers peuvent maintenant être :');
  console.log('1. Visualisés dans le PDF Viewer');
  console.log('2. Téléchargés par les utilisateurs');
  console.log('3. Ouverts dans un nouvel onglet');
  
  console.log('\n🔗 URLs de test:');
  sampleFiles.forEach(filename => {
    console.log(`http://localhost:3000/programme/pdf/${filename}`);
  });
}

createSamplePDFs().catch(console.error);

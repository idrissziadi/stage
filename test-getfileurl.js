// Test script for getFileUrl function
const API_BASE_URL = 'http://localhost:3000';

function getFileUrl(filePath, fileType = 'cours') {
  // If the filePath already includes the upload directory, use it as is
  if (filePath.startsWith('upload/')) {
    return `${API_BASE_URL}/${filePath}`;
  }
  // Otherwise, construct the full path
  return `${API_BASE_URL}/upload/${fileType}/${filePath}`;
}

console.log('=== Testing getFileUrl function ===\n');

// Test cases
const testCases = [
  {
    name: 'Full path from database (how backend stores it)',
    input: 'upload/cours/cours-1756341827975-565469752.pdf',
    expected: 'http://localhost:3000/upload/cours/cours-1756341827975-565469752.pdf'
  },
  {
    name: 'Filename only (old way)',
    input: 'cours-1756341827975-565469752.pdf',
    fileType: 'cours',
    expected: 'http://localhost:3000/upload/cours/cours-1756341827975-565469752.pdf'
  },
  {
    name: 'Memoire file (full path)',
    input: 'upload/memoires/memoire-123.pdf',
    expected: 'http://localhost:3000/upload/memoires/memoire-123.pdf'
  },
  {
    name: 'Programme file (filename only)',
    input: 'programme-456.pdf',
    fileType: 'programmes',
    expected: 'http://localhost:3000/upload/programmes/programme-456.pdf'
  }
];

testCases.forEach((testCase, index) => {
  const result = testCase.fileType 
    ? getFileUrl(testCase.input, testCase.fileType)
    : getFileUrl(testCase.input);
  
  const passed = result === testCase.expected;
  
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Input: ${testCase.input}`);
  console.log(`Expected: ${testCase.expected}`);
  console.log(`Result: ${result}`);
  console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('---');
});

// Test the problematic case from the error
console.log('\n=== Testing the problematic case ===');
const problematicFile = 'upload/cours/cours-1756341827975-565469752.pdf';
const result = getFileUrl(problematicFile);
console.log(`Input: ${problematicFile}`);
console.log(`Result: ${result}`);
console.log(`Should NOT contain: /upload/cours/upload/cours/`);
console.log(`Contains double path: ${result.includes('/upload/cours/upload/cours/') ? '❌ YES (BAD)' : '✅ NO (GOOD)'}`);
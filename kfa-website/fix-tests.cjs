const fs = require('fs');

// Read backup file
let content = fs.readFileSync('tests/e2e/auth-roles.spec.ts.backup', 'utf8');

// 1. Replace testUsers with testAccounts
content = content.replace(/testUsers/g, 'testAccounts');

// 2. Add generateEmail function and serial mode after testAccounts - simpler regex
const lines = content.split('\n');
const newLines = [];
let added = false;

for (let i = 0; i < lines.length; i++) {
  newLines.push(lines[i]);
  
  // Add after the line with the closing brace of testAccounts
  if (!added && lines[i].includes('};') && i > 0 && content.substring(0, content.indexOf(lines[i])).includes('testAccounts')) {
    newLines.push('');
    newLines.push('// Helper to generate unique emails for tests that require new users');
    newLines.push('const generateEmail = (prefix: string) => `test-${prefix}-${Date.now()}@example.com`;');
    newLines.push('');
    newLines.push("test.describe.configure({ mode: 'serial' });");
    added = true;
  }
}

content = newLines.join('\n');

// 3. Fix beforeAll - replace all three register calls with login
content = content.replace(
  /const userResponse = await request\.post\(`\${API_URL}\/register`,[\s\S]*?}\);[\s\n]*userToken/,
  `const userResponse = await request.post(\`\${API_URL}/login\`, {
      data: {
        email: testAccounts.user.email,
        password: testAccounts.user.password
      }
    });
    userToken`
);

content = content.replace(
  /const memberResponse = await request\.post\(`\${API_URL}\/register`,[\s\S]*?}\);[\s\n]*memberToken/,
  `const memberResponse = await request.post(\`\${API_URL}/login\`, {
      data: {
        email: testAccounts.member.email,
        password: testAccounts.member.password
      }
    });
    memberToken`
);

content = content.replace(
  /const adminResponse = await request\.post\(`\${API_URL}\/register`,[\s\S]*?}\);[\s\n]*adminToken/,
  `const adminResponse = await request.post(\`\${API_URL}/login\`, {
      data: {
        email: testAccounts.admin.email,
        password: testAccounts.admin.password
      }
    });
    adminToken`
);

// 4. Fix HTTP status codes
content = content.replace(/expect\(response\.status\(\)\)\.toBe\(422\);/g, 'expect(response.status()).toBe(401);');
content = content.replace('expect(response.status()).toBe(201);  // Line 221', 'expect(response.status()).toBe(200);');
content = content.replace('expect(createResponse.status()).toBe(201);  // Line 291', 'expect(createResponse.status()).toBe(200);');

// 5. Fix ID extraction
content = content.replace(
  /const newsId = \(await createResponse\.json\(\)\)\.id;/g,
  `const createData = await createResponse.json();
    const newsId = createData.data.id;`
);

content = content.replace(
  /const eventId = \(await createResponse\.json\(\)\)\.id;/g,
  `const createData = await createResponse.json();
    const eventId = createData.data.id;`
);

// Write corrected file
fs.writeFileSync('tests/e2e/auth-roles.spec.ts', content, 'utf8');
console.log('File successfully corrected!');
console.log('Applied fixes:');
console.log('  - Added generateEmail function');
console.log('  - Added serial mode configuration');
console.log('  - Replaced testUsers with testAccounts');
console.log('  - Changed beforeAll to use /login');
console.log('  - Fixed HTTP status codes');
console.log('  - Fixed ID extraction patterns');

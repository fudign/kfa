const fs = require('fs');

let content = fs.readFileSync('tests/e2e/auth-roles.spec.ts', 'utf8');

// Remove the unnecessary registration block from login test (lines 75-83)
content = content.replace(
  /test\('should login with correct credentials', async \(\{ request \}\) => \{[\s\S]*?\/\/ First register\n[\s\S]*?await request\.post\(`\$\{API_URL\}\/register`[\s\S]*?\}\);[\s\n]*\/\/ Then login/,
  `test('should login with correct credentials', async ({ request }) => {
    // Login with seeded account
    // Then login`,
);

fs.writeFileSync('tests/e2e/auth-roles.spec.ts', content, 'utf8');
console.log('✅ Removed unnecessary registration from login test');

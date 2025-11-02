const fs = require('fs');

let content = fs.readFileSync('tests/e2e/auth-roles.spec.ts', 'utf8');

// Replace the logout test registration with login
content = content.replace(
  /test\('logout invalidates token', async \(\{ request \}\) => \{[\s\S]*?\/\/ Register and get token\n[\s\S]*?const registerResponse = await request\.post\(`\$\{API_URL\}\/register`,[\s\S]*?\}\);[\s\n]*const \{ token \} = await registerResponse\.json\(\);/,
  `test('logout invalidates token', async ({ request }) => {
    // Login with seeded account to get token
    const loginResponse = await request.post(\`\${API_URL}/login\`, {
      data: {
        email: testAccounts.user.email,
        password: testAccounts.user.password
      }
    });
    const { token } = await loginResponse.json();`
);

fs.writeFileSync('tests/e2e/auth-roles.spec.ts', content, 'utf8');
console.log('✅ Fixed logout test: using login instead of registration');

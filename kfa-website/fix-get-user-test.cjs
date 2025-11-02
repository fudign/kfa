const fs = require('fs');

let content = fs.readFileSync('tests/e2e/auth-roles.spec.ts', 'utf8');

// Replace the registration with login using seeded account
content = content.replace(
  /test\('should get user info with valid token', async \(\{ request \}\) => \{[\s\S]*?\/\/ Register and login\n[\s\S]*?const registerResponse = await request\.post\(`\$\{API_URL\}\/register`,[\s\S]*?\}\);[\s\n]*const \{ token \} = await registerResponse\.json\(\);/,
  `test('should get user info with valid token', async ({ request }) => {
    // Login with seeded account
    const loginResponse = await request.post(\`\${API_URL}/login\`, {
      data: {
        email: testAccounts.admin.email,
        password: testAccounts.admin.password
      }
    });
    
    const { token } = await loginResponse.json();`
);

// Fix status code from 201 to 200 for GET /api/user
content = content.replace(
  /\/\/ Get user info[\s\S]*?expect\(response\.status\(\)\)\.toBe\(201\);/,
  `// Get user info
    const response = await request.get(\`\${API_URL}/user\`, {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);`
);

fs.writeFileSync('tests/e2e/auth-roles.spec.ts', content, 'utf8');
console.log('✅ Fixed get user info test: using login instead of registration + fixed status code 201→200');

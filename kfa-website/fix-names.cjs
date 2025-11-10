const fs = require('fs');

let content = fs.readFileSync('tests/e2e/auth-roles.spec.ts', 'utf8');

// Test 1: Replace name for default user role
content = content.replace(
  /test\('should register a new user with default role'[^{]*\{[^}]*const response = await request\.post\(`\$\{API_URL\}\/register`,\s*\{[\s\S]*?data:\s*\{\s*name:\s*testAccounts\.user\.name,/,
  (match) => match.replace('name: testAccounts.user.name,', "name: 'Test User',"),
);

// Test 2: Replace name for member role
content = content.replace(
  /test\('should register a new member with member role'[^{]*\{[^}]*const response = await request\.post\(`\$\{API_URL\}\/register`,\s*\{[\s\S]*?data:\s*\{\s*name:\s*testAccounts\.member\.name,/,
  (match) => match.replace('name: testAccounts.member.name,', "name: 'Test Member',"),
);

// Test 3: Replace name for admin role
content = content.replace(
  /test\('should register a new admin with admin role'[^{]*\{[^}]*const response = await request\.post\(`\$\{API_URL\}\/register`,\s*\{[\s\S]*?data:\s*\{\s*name:\s*testAccounts\.admin\.name,/,
  (match) => match.replace('name: testAccounts.admin.name,', "name: 'Test Admin',"),
);

fs.writeFileSync('tests/e2e/auth-roles.spec.ts', content, 'utf8');
console.log('✅ Fixed name properties in registration tests');

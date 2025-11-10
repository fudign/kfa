const fs = require('fs');

let content = fs.readFileSync('tests/e2e/auth-roles.spec.ts', 'utf8');

// Simple direct replacements
content = content.replace('name: testAccounts.user.name,', "name: 'Test User',");

content = content.replace('name: testAccounts.member.name,', "name: 'Test Member',");

content = content.replace('name: testAccounts.admin.name,', "name: 'Test Admin',");

fs.writeFileSync('tests/e2e/auth-roles.spec.ts', content, 'utf8');
console.log('✅ Replaced all name references with string literals');

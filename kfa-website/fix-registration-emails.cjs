const fs = require('fs');

let content = fs.readFileSync('tests/e2e/auth-roles.spec.ts', 'utf8');

// Fix first test - replace testAccounts.user.email with generateEmail
content = content.replace(/test\('should register a new user with default role'[\s\S]*?email: testAccounts\.user\.email,/, (match) =>
  match.replace('email: testAccounts.user.email,', "email: generateEmail('user'),"),
);

// Fix second test - replace testAccounts.member.email with generateEmail
content = content.replace(/test\('should register a new member with member role'[\s\S]*?email: testAccounts\.member\.email,/, (match) =>
  match.replace('email: testAccounts.member.email,', "email: generateEmail('member'),"),
);

// Fix third test - replace testAccounts.admin.email with generateEmail
content = content.replace(/test\('should register a new admin with admin role'[\s\S]*?email: testAccounts\.admin\.email,/, (match) =>
  match.replace('email: testAccounts.admin.email,', "email: generateEmail('admin'),"),
);

fs.writeFileSync('tests/e2e/auth-roles.spec.ts', content, 'utf8');
console.log('✅ Fixed registration emails to use generateEmail()');

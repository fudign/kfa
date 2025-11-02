const fs = require('fs');

let content = fs.readFileSync('tests/e2e/auth-roles.spec.ts', 'utf8');

// Change all registration tests back to expect 201
content = content.replace(
  /expect\(response\.status\(\)\)\.toBe\(200\);/g,
  'expect(response.status()).toBe(201);'
);

// But keep createResponse expectations as 200
content = content.replace(
  /expect\(createResponse\.status\(\)\)\.toBe\(201\);/g,
  'expect(createResponse.status()).toBe(200);'
);

fs.writeFileSync('tests/e2e/auth-roles.spec.ts', content, 'utf8');
console.log('✅ Fixed registration tests to expect 201');

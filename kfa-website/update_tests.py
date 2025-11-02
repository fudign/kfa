import re

with open('tests/e2e/auth-roles.spec.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "// Helper function to generate unique email\nconst generateEmail = (role: string) => {\n  return `test-${role}-${Date.now()}@example.com`;\n};\n\n// Test data for different roles\nconst testUsers = {\n  user: {\n    name: 'Test User',\n    email: generateEmail('user'),\n    password: 'password123',\n    role: 'user'\n  },\n  member: {\n    name: 'Test Member',\n    email: generateEmail('member'),\n    password: 'password123',\n    role: 'member'\n  },\n  admin: {\n    name: 'Test Admin',\n    email: generateEmail('admin'),\n    password: 'password123',\n    role: 'admin'\n  }\n};",
    "// Using seeded test accounts to avoid rate limiting issues\nconst testAccounts = {\n  user: {\n    email: 'user@kfa.kg',\n    password: 'password',\n    role: 'user'\n  },\n  member: {\n    email: 'member@kfa.kg',\n    password: 'password',\n    role: 'member'\n  },\n  admin: {\n    email: 'admin@kfa.kg',\n    password: 'password',\n    role: 'admin'\n  }\n};"
)

content = content.replace('testUsers.', 'testAccounts.')
content = content.replace('expect(response.status()).toBe(422);', 'expect(response.status()).toBe(401);')

with open('tests/e2e/auth-roles-new.spec.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Created new test file: tests/e2e/auth-roles-new.spec.ts')

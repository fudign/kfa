#!/usr/bin/env node
/**
 * Documentation Validator
 * Checks for missing or outdated documentation
 */

const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '../../docs');
const requiredDocs = ['README.md', 'QUICK-START.md', 'DEPLOY-INSTRUCTIONS.md', 'API.md', 'DATABASE.md'];

const checkDocExists = (filename) => {
  const fullPath = path.join(docsPath, filename);
  return {
    filename,
    exists: fs.existsSync(fullPath),
    path: fullPath,
    size: fs.existsSync(fullPath) ? fs.statSync(fullPath).size : 0,
  };
};

const result = {
  success: true,
  timestamp: new Date().toISOString(),
  docsPath,
  required: requiredDocs.map(checkDocExists),
};

result.missing = result.required.filter((d) => !d.exists);
result.success = result.missing.length === 0;

console.log(JSON.stringify(result, null, 2));
process.exit(result.success ? 0 : 1);

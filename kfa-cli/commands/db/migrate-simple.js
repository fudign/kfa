#!/usr/bin/env node
/**
 * Database Migrate - Simple Version
 * No classes, direct execution
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendPath = path.join(process.cwd(), 'kfa-backend', 'kfa-api');
const args = process.argv.slice(2);
const fresh = args.includes('--fresh');
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

try {
  const cmd = fresh ? 'php artisan migrate:fresh' : 'php artisan migrate';
  console.log(`Running: ${cmd}...`);

  const output = execSync(cmd, {
    cwd: backendPath,
    encoding: 'utf8'
  });

  const result = {
    success: true,
    command: cmd,
    output,
    timestamp: new Date().toISOString()
  };

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    console.log(`✓ Migration complete. Output: ${outputFile}`);
  } else {
    console.log('✓ Migration complete');
    console.log(output);
  }

  process.exit(0);

} catch (error) {
  const result = {
    success: false,
    error: error.message,
    stderr: error.stderr?.toString() || '',
    timestamp: new Date().toISOString()
  };

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    console.error(`✗ Migration failed. Output: ${outputFile}`);
  } else {
    console.error('✗ Migration failed');
    console.error(error.message);
  }

  process.exit(1);
}

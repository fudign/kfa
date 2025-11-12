#!/usr/bin/env node
/**
 * Database Migration Tool
 * Runs Laravel migrations with options
 */

const { exec } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const fresh = args.includes('--fresh');
const seed = args.includes('--seed');

const backendPath = path.join(__dirname, '../../kfa-backend/kfa-api');

// Build command
let cmd = 'php artisan migrate';
if (fresh) cmd = 'php artisan migrate:fresh';
if (seed) cmd += ' --seed';

const fullCmd = `cd "${backendPath}" && ${cmd}`;

exec(fullCmd, (error, stdout, stderr) => {
  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    command: cmd,
    output: stdout,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});

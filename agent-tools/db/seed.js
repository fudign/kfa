#!/usr/bin/env node
/**
 * Database Seeder Tool
 * Seeds database with test data
 */

const { exec } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const classArg = args.find((a) => a.startsWith('--class='));
const seederClass = classArg ? classArg.split('=')[1] : 'DatabaseSeeder';

const backendPath = path.join(__dirname, '../../kfa-backend/kfa-api');
const cmd = `cd "${backendPath}" && php artisan db:seed --class=${seederClass}`;

exec(cmd, (error, stdout, stderr) => {
  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    seeder: seederClass,
    output: stdout,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});

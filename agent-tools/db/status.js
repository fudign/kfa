#!/usr/bin/env node
/**
 * Database Status Tool
 * Checks connection and lists tables
 */

const { exec } = require('child_process');
const path = require('path');

const backendPath = path.join(__dirname, '../../kfa-backend/kfa-api');

// Test database connection
const testCmd = `cd "${backendPath}" && php artisan db:show`;

exec(testCmd, (error, stdout, stderr) => {
  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    connected: !error,
    output: stdout,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});

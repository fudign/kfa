#!/usr/bin/env node
/**
 * Backend Build Tool
 * Optimizes Laravel app for production
 */

const { exec } = require('child_process');
const path = require('path');

const backendPath = path.join(__dirname, '../../kfa-backend/kfa-api');

const commands = [
  'php artisan config:cache',
  'php artisan route:cache',
  'php artisan view:cache',
  'composer install --no-dev --optimize-autoloader',
];

const runCommands = async () => {
  const results = [];

  for (const cmd of commands) {
    const fullCmd = `cd "${backendPath}" && ${cmd}`;

    await new Promise((resolve) => {
      exec(fullCmd, (error, stdout, stderr) => {
        results.push({
          command: cmd,
          success: !error,
          output: stdout,
          error: stderr || null,
        });
        resolve();
      });
    });
  }

  return results;
};

runCommands().then((results) => {
  const allSuccess = results.every((r) => r.success);

  const result = {
    success: allSuccess,
    timestamp: new Date().toISOString(),
    commands: results,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(allSuccess ? 0 : 1);
});

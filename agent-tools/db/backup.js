#!/usr/bin/env node
/**
 * Database Backup Tool
 * Creates timestamped database backup
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const outputArg = args.find((a) => a.startsWith('--output='));
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const defaultOutput = `backups/db-backup-${timestamp}.sql`;
const output = outputArg ? outputArg.split('=')[1] : defaultOutput;

const backendPath = path.join(__dirname, '../../kfa-backend/kfa-api');
const backupDir = path.dirname(output);

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Get DB credentials from .env
const envPath = path.join(backendPath, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
};

const dbHost = getEnv('DB_HOST') || 'localhost';
const dbPort = getEnv('DB_PORT') || '5432';
const dbName = getEnv('DB_DATABASE');
const dbUser = getEnv('DB_USERNAME');
const dbPass = getEnv('DB_PASSWORD');

const cmd = `PGPASSWORD="${dbPass}" pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName} > ${output}`;

exec(cmd, (error, stdout, stderr) => {
  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    backupFile: path.resolve(output),
    size: fs.existsSync(output) ? fs.statSync(output).size : 0,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});

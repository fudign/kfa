#!/usr/bin/env node
/**
 * Environment Verification Tool
 * Checks required environment variables
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const envArg = args.find((a) => a.startsWith('--env='));
const envPath = envArg ? envArg.split('=')[1] : path.join(__dirname, '../../kfa-backend/kfa-api/.env');

// Required environment variables
const required = {
  backend: [
    'APP_NAME',
    'APP_ENV',
    'APP_KEY',
    'APP_URL',
    'DB_CONNECTION',
    'DB_HOST',
    'DB_PORT',
    'DB_DATABASE',
    'DB_USERNAME',
    'DB_PASSWORD',
    'SUPABASE_URL',
    'SUPABASE_KEY',
  ],
  frontend: ['VITE_API_BASE_URL', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'],
};

const checkEnv = (filePath, vars) => {
  if (!fs.existsSync(filePath)) {
    return { exists: false, missing: vars, invalid: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const missing = [];
  const invalid = [];

  for (const varName of vars) {
    const regex = new RegExp(`^${varName}=(.*)$`, 'm');
    const match = content.match(regex);

    if (!match) {
      missing.push(varName);
    } else if (!match[1] || match[1].trim() === '') {
      invalid.push(varName);
    }
  }

  return { exists: true, missing, invalid };
};

const backendEnvPath = path.join(__dirname, '../../kfa-backend/kfa-api/.env');
const frontendEnvPath = path.join(__dirname, '../../kfa-website/.env');

const result = {
  success: true,
  timestamp: new Date().toISOString(),
  backend: checkEnv(backendEnvPath, required.backend),
  frontend: checkEnv(frontendEnvPath, required.frontend),
};

result.success =
  result.backend.exists &&
  result.backend.missing.length === 0 &&
  result.backend.invalid.length === 0 &&
  result.frontend.exists &&
  result.frontend.missing.length === 0 &&
  result.frontend.invalid.length === 0;

console.log(JSON.stringify(result, null, 2));
process.exit(result.success ? 0 : 1);

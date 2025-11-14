#!/usr/bin/env node
/**
 * Database Status - Simple Version
 * No classes, no abstractions, just a single script
 * Follows: https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Direct execution - no classes
const backendPath = path.join(process.cwd(), 'kfa-backend', 'kfa-api');
const envPath = path.join(backendPath, '.env');
const cacheDir = path.join(process.cwd(), '.kfa', 'cache', 'db');
const cacheFile = path.join(cacheDir, 'status.json');

// Parse CLI args
const args = process.argv.slice(2);
const useCache = !args.includes('--no-cache');
const format = args.includes('--json') ? 'json' : 'text';
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

// Simple cache check (6 hour TTL)
if (useCache && fs.existsSync(cacheFile)) {
  const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  if (Date.now() < cached.expires) {
    const output =
      format === 'json'
        ? JSON.stringify({ ...cached.data, cached: true }, null, 2)
        : `✓ Database: connected (cached)\n  Host: ${cached.data.host}\n  DB: ${cached.data.database}\n  Latency: ${cached.data.latency}ms`;

    if (outputFile) {
      fs.writeFileSync(outputFile, output);
      console.log(`Output written to: ${outputFile}`);
    } else {
      console.log(output);
    }
    process.exit(0);
  }
}

// Check database
const startTime = Date.now();
try {
  // Read env vars directly
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found');
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const getEnv = (key) => {
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim().replace(/^["']|["']$/g, '') : null;
  };

  const dbHost = getEnv('DB_HOST') || 'localhost';
  const dbName = getEnv('DB_DATABASE') || 'unknown';

  // Direct command execution
  execSync('php artisan db:show', {
    cwd: backendPath,
    stdio: 'pipe',
  });

  const latency = Date.now() - startTime;
  const result = {
    status: 'connected',
    host: dbHost,
    database: dbName,
    latency,
    timestamp: new Date().toISOString(),
  };

  // Write to cache
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  fs.writeFileSync(
    cacheFile,
    JSON.stringify({
      data: result,
      expires: Date.now() + 6 * 60 * 60 * 1000, // 6 hours
    }),
  );

  // Output
  const output =
    format === 'json'
      ? JSON.stringify({ ...result, cached: false }, null, 2)
      : `✓ Database: connected\n  Host: ${dbHost}\n  DB: ${dbName}\n  Latency: ${latency}ms`;

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`✓ Output written to: ${outputFile}`);
  } else {
    console.log(output);
  }

  process.exit(0);
} catch (error) {
  const output =
    format === 'json'
      ? JSON.stringify({ status: 'error', error: error.message }, null, 2)
      : `✗ Database: disconnected\n  Error: ${error.message}`;

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`✗ Output written to: ${outputFile}`);
  } else {
    console.error(output);
  }

  process.exit(1);
}

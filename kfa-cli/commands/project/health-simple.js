#!/usr/bin/env node
/**
 * Project Health Check - Simple Version
 * Checks overall project health without complex abstractions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const format = args.includes('--json') ? 'json' : 'text';
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

const checks = {
  nodeModules: false,
  packageJson: false,
  envFile: false,
  backendSetup: false,
  frontendSetup: false,
};

const details = {};

try {
  // Check node_modules
  checks.nodeModules = fs.existsSync(path.join(process.cwd(), 'node_modules'));
  details.nodeModules = checks.nodeModules ? '✓ Present' : '✗ Missing';

  // Check package.json
  const pkgPath = path.join(process.cwd(), 'package.json');
  checks.packageJson = fs.existsSync(pkgPath);
  if (checks.packageJson) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    details.packageJson = `✓ ${pkg.name || 'Unknown'} v${pkg.version || '0.0.0'}`;
  } else {
    details.packageJson = '✗ Missing';
  }

  // Check backend .env
  const envPath = path.join(process.cwd(), 'kfa-backend', 'kfa-api', '.env');
  checks.envFile = fs.existsSync(envPath);
  details.envFile = checks.envFile ? '✓ Present' : '✗ Missing';

  // Check backend setup
  const backendPath = path.join(process.cwd(), 'kfa-backend', 'kfa-api');
  checks.backendSetup = fs.existsSync(backendPath) && fs.existsSync(path.join(backendPath, 'artisan'));
  details.backendSetup = checks.backendSetup ? '✓ Laravel ready' : '✗ Not setup';

  // Check frontend setup
  const frontendPath = path.join(process.cwd(), 'kfa-website');
  checks.frontendSetup = fs.existsSync(frontendPath) && fs.existsSync(path.join(frontendPath, 'package.json'));
  details.frontendSetup = checks.frontendSetup ? '✓ React ready' : '✗ Not setup';

  // Calculate health score
  const total = Object.keys(checks).length;
  const passing = Object.values(checks).filter(Boolean).length;
  const score = Math.round((passing / total) * 100);
  const status = score >= 80 ? 'healthy' : score >= 50 ? 'warning' : 'critical';

  const result = {
    status,
    score,
    checks,
    details,
    timestamp: new Date().toISOString(),
  };

  const output =
    format === 'json'
      ? JSON.stringify(result, null, 2)
      : `Project Health: ${status.toUpperCase()} (${score}%)\n\n` +
        Object.entries(details)
          .map(([key, value]) => `  ${key}: ${value}`)
          .join('\n');

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`✓ Health check saved to: ${outputFile}`);
  } else {
    console.log(output);
  }

  process.exit(score >= 50 ? 0 : 1);
} catch (error) {
  const output = format === 'json' ? JSON.stringify({ error: error.message }, null, 2) : `✗ Health check failed: ${error.message}`;

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
  } else {
    console.error(output);
  }

  process.exit(1);
}

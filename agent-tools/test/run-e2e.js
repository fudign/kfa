#!/usr/bin/env node
/**
 * E2E Test Runner
 * Runs Playwright tests and outputs results
 */

const { exec } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const testArg = args.find((a) => a.startsWith('--test='));
const testName = testArg ? testArg.split('=')[1] : '';

const frontendPath = path.join(__dirname, '../../kfa-website');
const cmd = testName ? `cd "${frontendPath}" && npm run test:e2e -- ${testName}` : `cd "${frontendPath}" && npm run test:e2e`;

const startTime = Date.now();

exec(cmd, (error, stdout, stderr) => {
  const duration = Date.now() - startTime;

  // Parse Playwright output for pass/fail counts
  const passMatch = stdout.match(/(\d+) passed/);
  const failMatch = stdout.match(/(\d+) failed/);
  const skipMatch = stdout.match(/(\d+) skipped/);

  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    duration: `${duration}ms`,
    test: testName || 'all',
    passed: passMatch ? parseInt(passMatch[1]) : 0,
    failed: failMatch ? parseInt(failMatch[1]) : 0,
    skipped: skipMatch ? parseInt(skipMatch[1]) : 0,
    output: stdout,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});

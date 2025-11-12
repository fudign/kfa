#!/usr/bin/env node
/**
 * Unit Test Runner
 * Runs PHPUnit tests and outputs results
 */

const { exec } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const filterArg = args.find((a) => a.startsWith('--filter='));
const filter = filterArg ? filterArg.split('=')[1] : '';

const backendPath = path.join(__dirname, '../../kfa-backend/kfa-api');
const cmd = filter ? `cd "${backendPath}" && php artisan test --filter=${filter}` : `cd "${backendPath}" && php artisan test`;

const startTime = Date.now();

exec(cmd, (error, stdout, stderr) => {
  const duration = Date.now() - startTime;

  // Parse PHPUnit output for test counts
  const testMatch = stdout.match(/Tests:\s+(\d+)\s+passed/);
  const assertMatch = stdout.match(/Assertions:\s+(\d+)\s+passed/);

  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    duration: `${duration}ms`,
    filter: filter || 'all',
    tests: testMatch ? parseInt(testMatch[1]) : 0,
    assertions: assertMatch ? parseInt(assertMatch[1]) : 0,
    output: stdout,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});

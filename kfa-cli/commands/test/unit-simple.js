#!/usr/bin/env node
/**
 * Run Unit Tests - Simple Version
 * Direct npm test execution with file output
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const outputFile = args.includes('--output')
  ? args[args.indexOf('--output') + 1]
  : path.join(process.cwd(), '.kfa', 'test-results', `unit-${Date.now()}.txt`);

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Running unit tests...');

const startTime = Date.now();
const logStream = fs.createWriteStream(outputFile);

// Direct test execution
const proc = spawn('npm', ['test'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'pipe'],
});

// Stream output to both console and file
proc.stdout.on('data', (data) => {
  process.stdout.write(data);
  logStream.write(data);
});

proc.stderr.on('data', (data) => {
  process.stderr.write(data);
  logStream.write(data);
});

proc.on('close', (code) => {
  const duration = Date.now() - startTime;
  const summary = `\n\n--- Test Summary ---\nDuration: ${duration}ms\nExit Code: ${code}\nTimestamp: ${new Date().toISOString()}\n`;

  logStream.write(summary);
  logStream.end();

  console.log(summary);
  console.log(`Full output saved to: ${outputFile}`);

  process.exit(code);
});

/**
 * Run unit tests
 *
 * Usage: kfa test unit [--no-cache] [--format json|text]
 */

const { spawn } = require('child_process');
const path = require('path');
const { Cache } = require('../../lib/cache');
const { getProjectRoot, outputJSON, success, error, Spinner, parseArgs, formatDuration } = require('../../lib/utils');

async function execute(args) {
  const { flags } = parseArgs(args);
  const format = flags.format || 'text';
  const useCache = !flags['no-cache'];

  const cache = new Cache('test', { ttl: 6 * 60 * 60 }); // 6 hours
  const cacheKey = 'unit-tests';

  // Try cache first
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      if (format === 'json') {
        outputJSON({ ...cached, cached: true });
      } else {
        if (cached.success) {
          success(`Unit tests: ${cached.passed}/${cached.total} passed (cached)`);
        } else {
          error(`Unit tests: ${cached.failed}/${cached.total} failed (cached)`);
        }
        console.log(`  Duration: ${formatDuration(cached.duration)}`);
        console.log(`  Cached:   Yes`);
      }
      return;
    }
  }

  // Run tests
  const spinner = format === 'text' ? new Spinner('Running unit tests...') : null;
  if (spinner) spinner.start();

  const projectRoot = getProjectRoot();
  const frontendPath = path.join(projectRoot, 'kfa-website');

  const startTime = Date.now();

  try {
    const result = await runVitest(frontendPath);
    const duration = Date.now() - startTime;

    const testResult = {
      success: result.exitCode === 0,
      passed: result.passed || 0,
      failed: result.failed || 0,
      total: result.total || 0,
      duration,
      timestamp: new Date().toISOString(),
    };

    // Cache successful results
    if (useCache && testResult.success) {
      cache.set(cacheKey, testResult);
    }

    if (spinner) spinner.stop();

    if (format === 'json') {
      outputJSON({ ...testResult, cached: false });
    } else {
      if (testResult.success) {
        success(`Unit tests: ${testResult.passed}/${testResult.total} passed`);
      } else {
        error(`Unit tests: ${testResult.failed}/${testResult.total} failed`);
      }
      console.log(`  Duration: ${formatDuration(testResult.duration)}`);
      console.log(`  Cached:   No`);
    }

    if (!testResult.success) {
      process.exit(1);
    }
  } catch (err) {
    if (spinner) spinner.fail('Unit tests failed');

    if (format === 'json') {
      outputJSON({ success: false, error: err.message });
    } else {
      error(`Unit tests error: ${err.message}`);
    }

    process.exit(1);
  }
}

async function runVitest(cwd) {
  return new Promise((resolve) => {
    const proc = spawn('npm', ['test'], { cwd, shell: true });

    let output = '';

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', (code) => {
      // Parse output for test results
      const passed = output.match(/(\d+) passed/)?.[1] || 0;
      const failed = output.match(/(\d+) failed/)?.[1] || 0;
      const total = parseInt(passed) + parseInt(failed);

      resolve({
        exitCode: code,
        passed: parseInt(passed),
        failed: parseInt(failed),
        total,
        output,
      });
    });

    proc.on('error', () => {
      resolve({ exitCode: 1, passed: 0, failed: 0, total: 0, output });
    });
  });
}

module.exports = { execute };

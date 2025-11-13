/**
 * Build project for production
 *
 * Usage: kfa deploy build [--frontend] [--backend] [--format json|text]
 */

const { spawn } = require('child_process');
const path = require('path');
const { getProjectRoot, success, error, Spinner, parseArgs, formatDuration } = require('../../lib/utils');

async function execute(args) {
  const { flags } = parseArgs(args);
  const format = flags.format || 'text';
  const frontendOnly = flags.frontend;
  const backendOnly = flags.backend;
  const buildBoth = !frontendOnly && !backendOnly;

  const projectRoot = getProjectRoot();
  const results = {
    frontend: null,
    backend: null,
    success: false,
  };

  // Build frontend
  if (buildBoth || frontendOnly) {
    if (format === 'text') {
      console.log('\n📦 Building Frontend...\n');
    }

    const spinner = format === 'text' ? new Spinner('Building React + Vite...') : null;
    if (spinner) spinner.start();

    const startTime = Date.now();

    try {
      const frontendPath = path.join(projectRoot, 'kfa-website');
      await runCommand('npm', ['run', 'build'], frontendPath);

      const duration = Date.now() - startTime;

      results.frontend = {
        success: true,
        duration,
      };

      if (spinner) spinner.succeed(`Frontend built in ${formatDuration(duration)}`);
    } catch (err) {
      results.frontend = {
        success: false,
        error: err.message,
      };

      if (spinner) spinner.fail('Frontend build failed');

      if (format === 'text') {
        error(err.message);
      }
    }
  }

  // Build/optimize backend
  if (buildBoth || backendOnly) {
    if (format === 'text') {
      console.log('\n⚙️  Optimizing Backend...\n');
    }

    const spinner = format === 'text' ? new Spinner('Running Laravel optimize...') : null;
    if (spinner) spinner.start();

    const startTime = Date.now();

    try {
      const backendPath = path.join(projectRoot, 'kfa-backend', 'kfa-api');
      await runCommand('php', ['artisan', 'optimize'], backendPath);

      const duration = Date.now() - startTime;

      results.backend = {
        success: true,
        duration,
      };

      if (spinner) spinner.succeed(`Backend optimized in ${formatDuration(duration)}`);
    } catch (err) {
      results.backend = {
        success: false,
        error: err.message,
      };

      if (spinner) spinner.fail('Backend optimization failed');

      if (format === 'text') {
        error(err.message);
      }
    }
  }

  // Determine overall success
  results.success = (!results.frontend || results.frontend.success) && (!results.backend || results.backend.success);

  // Output results
  if (format === 'json') {
    const { outputJSON } = require('../../lib/utils');
    outputJSON(results);
  } else {
    console.log('\n📊 Build Summary\n');

    if (results.frontend) {
      if (results.frontend.success) {
        success('Frontend: Built successfully');
      } else {
        error('Frontend: Build failed');
      }
    }

    if (results.backend) {
      if (results.backend.success) {
        success('Backend: Optimized successfully');
      } else {
        error('Backend: Optimization failed');
      }
    }

    if (results.success) {
      success('\n✅ Build completed!');
    } else {
      error('\n❌ Build failed');
      process.exit(1);
    }
  }
}

async function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { cwd, shell: true });

    let output = '';

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(output || 'Command failed'));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = { execute };

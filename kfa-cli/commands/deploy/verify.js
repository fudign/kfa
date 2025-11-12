const { fileExists, outputSuccess, outputError, outputInfo, outputJSON } = require('../../lib/utils');
const path = require('path');
const fs = require('fs');

function execute(args) {
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
  
  const checks = {
    frontend: {
      envFile: fileExists(path.join(process.cwd(), 'kfa-website', '.env')),
      packageJson: fileExists(path.join(process.cwd(), 'kfa-website', 'package.json')),
      distDir: fileExists(path.join(process.cwd(), 'kfa-website', 'dist'))
    },
    backend: {
      envFile: fileExists(path.join(process.cwd(), 'kfa-backend', 'kfa-api', '.env')),
      composerJson: fileExists(path.join(process.cwd(), 'kfa-backend', 'kfa-api', 'composer.json'))
    }
  };
  
  const allPassed = Object.values(checks.frontend).every(v => v) && 
                    Object.values(checks.backend).every(v => v);
  
  if (format === 'json') {
    outputJSON({ success: allPassed, checks });
  } else {
    outputInfo('Deployment verification:');
    outputInfo('  Frontend:');
    outputInfo('    .env: ' + (checks.frontend.envFile ? 'OK' : 'MISSING'));
    outputInfo('    package.json: ' + (checks.frontend.packageJson ? 'OK' : 'MISSING'));
    outputInfo('    dist/: ' + (checks.frontend.distDir ? 'OK' : 'MISSING'));
    outputInfo('  Backend:');
    outputInfo('    .env: ' + (checks.backend.envFile ? 'OK' : 'MISSING'));
    outputInfo('    composer.json: ' + (checks.backend.composerJson ? 'OK' : 'MISSING'));
    
    if (allPassed) {
      outputSuccess('Deployment verification passed');
    } else {
      outputError('Deployment verification failed');
    }
  }
  
  process.exit(allPassed ? 0 : 1);
}

module.exports = { execute };

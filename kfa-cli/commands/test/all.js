const { execCommand, outputSuccess, outputError, outputInfo, outputJSON } = require('../../lib/utils');
const path = require('path');

async function execute(args) {
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
  
  const results = {
    unit: { success: false, output: '' },
    e2e: { success: false, output: '' }
  };
  
  outputInfo('Running all tests...');
  
  try {
    outputInfo('  Running unit tests...');
    const unitResult = await execCommand('npm test', { 
      cwd: path.join(process.cwd(), 'kfa-website') 
    });
    results.unit = { success: true, output: unitResult.stdout };
    outputSuccess('    Unit tests passed');
  } catch (error) {
    results.unit = { success: false, output: error.stderr || error.message };
    outputError('    Unit tests failed');
  }
  
  try {
    outputInfo('  Running E2E tests...');
    const e2eResult = await execCommand('npm run test:e2e', { 
      cwd: path.join(process.cwd(), 'kfa-website') 
    });
    results.e2e = { success: true, output: e2eResult.stdout };
    outputSuccess('    E2E tests passed');
  } catch (error) {
    results.e2e = { success: false, output: error.stderr || error.message };
    outputError('    E2E tests failed');
  }
  
  const allPassed = results.unit.success && results.e2e.success;
  
  if (format === 'json') {
    outputJSON({ success: allPassed, results });
  } else {
    if (allPassed) {
      outputSuccess('All tests passed!');
    } else {
      outputError('Some tests failed');
    }
  }
  
  process.exit(allPassed ? 0 : 1);
}

module.exports = { execute };

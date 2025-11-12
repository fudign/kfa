const { PythonAdapter } = require('../../lib/python');
const { outputInfo, outputSuccess, outputError, parseFormat } = require('../../lib/utils');

/**
 * Check ADW availability (uv, Python, scripts)
 * Usage: kfa adw check [--format json]
 */
async function execute(args) {
  const format = parseFormat(args);
  const python = new PythonAdapter();

  try {
    const uvCheck = await python.checkAvailability();

    if (format === 'json') {
      console.log(JSON.stringify(uvCheck, null, 2));
    } else {
      if (uvCheck.available) {
        outputSuccess('ADW is available');
        outputInfo('uv version: ' + uvCheck.version);
        outputInfo('ADW scripts: adws/');
      } else {
        outputError('ADW not available');
        outputInfo('Install uv: https://astral.sh/uv/install');
      }
    }

  } catch (err) {
    if (format === 'json') {
      console.log(JSON.stringify({ available: false, error: String(err) }, null, 2));
    } else {
      outputError('ADW not available');
      outputInfo('Error: ' + String(err));
      outputInfo('\nInstall uv to use ADW:');
      outputInfo('  Windows: powershell -c "irm https://astral.sh/uv/install.ps1 | iex"');
      outputInfo('  Linux/Mac: curl -LsSf https://astral.sh/uv/install.sh | sh');
    }
    process.exit(1);
  }
}

module.exports = { execute };

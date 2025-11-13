const { PythonAdapter } = require('../../lib/python');
const { outputInfo, outputSuccess, outputError, parseFormat } = require('../../lib/utils');

/**
 * Get latest ADW execution status
 * Usage: kfa adw status [--format json]
 */
function execute(args) {
  const format = parseFormat(args);
  const python = new PythonAdapter();

  try {
    const result = python.getLatestResult();

    if (!result) {
      if (format === 'json') {
        console.log(JSON.stringify({ status: 'no_executions' }, null, 2));
      } else {
        outputInfo('No ADW executions found');
        outputInfo('Run: kfa adw prompt "..." or kfa adw slash /...');
      }
      return;
    }

    if (format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      outputSuccess('Latest ADW Execution:\n');
      outputInfo('ADW ID: ' + result.adwId);
      outputInfo('Status: ' + (result.success ? 'Success' : 'Failed'));

      if (result.prompt) {
        outputInfo('Type: Prompt');
        outputInfo('Prompt: ' + result.prompt);
      } else if (result.slash_command) {
        outputInfo('Type: Slash Command');
        outputInfo('Command: ' + result.slash_command);
        if (result.args && result.args.length > 0) {
          outputInfo('Args: ' + result.args.join(' '));
        }
      }

      if (result.model) {
        outputInfo('Model: ' + result.model);
      }

      if (result.session_id) {
        outputInfo('Session: ' + result.session_id);
      }

      outputInfo('\nResults: ' + result.summaryPath);
    }
  } catch (err) {
    if (format === 'json') {
      console.log(JSON.stringify({ error: String(err) }, null, 2));
    } else {
      outputError('Error: ' + String(err));
    }
    process.exit(1);
  }
}

module.exports = { execute };

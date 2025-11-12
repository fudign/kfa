const { PythonAdapter } = require('../../lib/python');
const { outputInfo, outputSuccess, outputError, parseFormat } = require('../../lib/utils');

/**
 * Execute chore workflow (planning + implementation) via ADW
 * Usage: kfa adw chore "Task description" [options]
 */
async function execute(args) {
  // Parse arguments
  const taskIndex = args.findIndex(arg => !arg.startsWith('--'));

  if (taskIndex === -1) {
    outputError('Usage: kfa adw chore "<task>" [options]');
    outputInfo('Options:');
    outputInfo('  --model sonnet|opus     Claude model (default: sonnet)');
    outputInfo('  --format json           Output format\n');
    outputInfo('Examples:');
    outputInfo('  kfa adw chore "Add user profile photo upload"');
    outputInfo('  kfa adw chore "Fix CORS issue" --model opus');
    process.exit(1);
  }

  const task = args[taskIndex];
  const format = parseFormat(args);

  // Parse options
  const options = {};

  const modelIndex = args.indexOf('--model');
  if (modelIndex !== -1 && args[modelIndex + 1]) {
    options.model = args[modelIndex + 1];
  }

  // Execute via Python adapter
  const python = new PythonAdapter();

  try {
    outputInfo('Executing chore workflow via ADW...');
    outputInfo('Task: ' + task + '\n');

    await python.runChoreImplement(task, options);

    // Get result
    const result = python.getLatestResult();

    if (format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result && result.success) {
        outputSuccess('Chore workflow completed successfully');
        outputInfo('ADW ID: ' + result.adwId);
        outputInfo('Results: ' + result.summaryPath);
      } else {
        outputError('Chore workflow failed');
        if (result) {
          outputInfo('ADW ID: ' + result.adwId);
          outputInfo('Details: ' + result.summaryPath);
        }
      }
    }

  } catch (err) {
    if (format === 'json') {
      console.log(JSON.stringify({ error: err.message || err.error }, null, 2));
    } else {
      outputError('Error: ' + (err.message || err.error));
    }
    process.exit(1);
  }
}

module.exports = { execute };

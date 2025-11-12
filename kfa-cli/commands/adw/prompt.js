const { PythonAdapter } = require('../../lib/python');
const { outputInfo, outputSuccess, outputError, parseFormat } = require('../../lib/utils');

/**
 * Execute ad-hoc Claude Code prompt via ADW
 * Usage: kfa adw prompt "Your prompt here" [--model sonnet|opus] [--agent-name name]
 */
async function execute(args) {
  // Parse arguments
  const promptIndex = args.findIndex(arg => !arg.startsWith('--'));

  if (promptIndex === -1) {
    outputError('Usage: kfa adw prompt "<prompt>" [options]');
    outputInfo('Options:');
    outputInfo('  --model sonnet|opus     Claude model (default: sonnet)');
    outputInfo('  --agent-name <name>     Agent name for tracking');
    outputInfo('  --no-retry              Disable retry on failure');
    outputInfo('  --format json           Output format\n');
    outputInfo('Example:');
    outputInfo('  kfa adw prompt "List TypeScript files" --model sonnet');
    process.exit(1);
  }

  const prompt = args[promptIndex];
  const format = parseFormat(args);

  // Parse options
  const options = {};

  const modelIndex = args.indexOf('--model');
  if (modelIndex !== -1 && args[modelIndex + 1]) {
    options.model = args[modelIndex + 1];
  }

  const agentNameIndex = args.indexOf('--agent-name');
  if (agentNameIndex !== -1 && args[agentNameIndex + 1]) {
    options.agentName = args[agentNameIndex + 1];
  }

  if (args.includes('--no-retry')) {
    options.noRetry = true;
  }

  // Execute via Python adapter
  const python = new PythonAdapter();

  try {
    outputInfo('Executing prompt via ADW...\n');

    await python.runPrompt(prompt, options);

    // Get result
    const result = python.getLatestResult();

    if (format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result && result.success) {
        outputSuccess('Prompt executed successfully');
        outputInfo('ADW ID: ' + result.adwId);
        outputInfo('Results: ' + result.summaryPath);
      } else {
        outputError('Prompt execution failed');
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

const { PythonAdapter } = require('../../lib/python');
const { outputInfo, outputSuccess, outputError, parseFormat } = require('../../lib/utils');

/**
 * Execute Claude Code slash command via ADW
 * Usage: kfa adw slash /command [args...] [options]
 */
async function execute(args) {
  // Find slash command (starts with /)
  const commandIndex = args.findIndex((arg) => arg.startsWith('/'));

  if (commandIndex === -1) {
    outputError('Usage: kfa adw slash /command [args...] [options]');
    outputInfo('Options:');
    outputInfo('  --model sonnet|opus     Claude model (default: sonnet)');
    outputInfo('  --agent-name <name>     Agent name for tracking');
    outputInfo('  --format json           Output format\n');
    outputInfo('Examples:');
    outputInfo('  kfa adw slash /chore "Add logging"');
    outputInfo('  kfa adw slash /implement specs/plan.md --model opus');
    process.exit(1);
  }

  const command = args[commandIndex];
  const format = parseFormat(args);

  // Collect command arguments (non-option args after command)
  const commandArgs = [];
  for (let i = commandIndex + 1; i < args.length; i++) {
    if (!args[i].startsWith('--')) {
      commandArgs.push(args[i]);
    } else {
      break; // Stop at first option
    }
  }

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

  // Execute via Python adapter
  const python = new PythonAdapter();

  try {
    outputInfo('Executing ' + command + ' via ADW...\n');

    await python.runSlashCommand(command, commandArgs, options);

    // Get result
    const result = python.getLatestResult();

    if (format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result && result.success) {
        outputSuccess('Command executed successfully');
        outputInfo('ADW ID: ' + result.adwId);
        outputInfo('Command: ' + command + ' ' + commandArgs.join(' '));
        outputInfo('Results: ' + result.summaryPath);
      } else {
        outputError('Command execution failed');
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

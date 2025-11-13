const { outputInfo, outputSuccess, outputError } = require('../../lib/utils');

function execute(args) {
  const prompt = args.join(' ');

  if (!prompt) {
    outputError('Usage: kfa agent run "<prompt>"');
    outputError('Example: kfa agent run "Analyze project structure"');
    process.exit(1);
  }

  outputInfo('Agent functionality will be available in future update.');
  outputInfo('For now, use prime prompts:\n');

  outputSuccess('Recommended approach:');
  outputInfo('  1. kfa prime list');
  outputInfo('  2. kfa prime show <category>/<prompt>');
  outputInfo('  3. kfa prime use <category>/<prompt> "<context>"');
  outputInfo('  4. Copy output to AI assistant\n');

  outputInfo('Your prompt: ' + prompt);
  outputInfo('Try: kfa prime list');
}

module.exports = { execute };

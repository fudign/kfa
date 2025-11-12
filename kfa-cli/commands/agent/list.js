const { outputSuccess, outputText } = require('../../lib/utils');

function execute(args) {
  outputSuccess('Available Workflows:\n');
  
  outputText('KFA Workflows:');
  outputText('  - kfa-charter: Generate KFA charter documents\n');
  
  outputText('Prime Prompts (Recommended):');
  outputText('  Use: kfa prime list');
  outputText('  Then: kfa prime use <category>/<prompt> "<context>"\n');
  
  outputText('Note: BMAD modules have been simplified.');
  outputText('Prime prompts provide better context efficiency (99% reduction).');
}

module.exports = { execute };

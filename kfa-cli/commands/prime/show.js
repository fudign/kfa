const { outputError } = require('../../lib/utils');
const fs = require('fs');
const path = require('path');

function execute(args) {
  const promptPath = args[0];
  
  if (!promptPath) {
    outputError('Usage: kfa prime show <category>/<prompt>');
    outputError('Example: kfa prime show development/feature-implementation');
    process.exit(1);
  }
  
  const fullPath = path.join(__dirname, '..', '..', 'prime-prompts', promptPath + '.md');
  
  if (!fs.existsSync(fullPath)) {
    outputError('Prime prompt not found: ' + promptPath);
    outputError('Run: kfa prime list');
    process.exit(1);
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  console.log(content);
}

module.exports = { execute };

const { outputError, outputSuccess, outputInfo, outputText } = require('../../lib/utils');
const fs = require('fs');
const path = require('path');

function execute(args) {
  const promptPath = args[0];
  const context = args[1];
  
  if (!promptPath || !context) {
    outputError('Usage: kfa prime use <category>/<prompt> "<context>"');
    outputError('Example: kfa prime use development/feature-implementation "Add news filtering"');
    process.exit(1);
  }
  
  const fullPath = path.join(__dirname, '..', '..', 'prime-prompts', promptPath + '.md');
  
  if (!fs.existsSync(fullPath)) {
    outputError('Prime prompt not found: ' + promptPath);
    outputError('Run: kfa prime list');
    process.exit(1);
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  const templateMatch = content.match(/## Prompt Template\n\n([\s\S]+?)(?=\n##|$)/);
  
  if (!templateMatch) {
    outputError('No prompt template found in: ' + promptPath);
    process.exit(1);
  }
  
  let template = templateMatch[1].trim();
  template = template.replace(/\{CONTEXT\}/g, context);
  
  outputSuccess('Prime Prompt: ' + promptPath);
  outputInfo('Context: ' + context);
  outputText('\n--- PROMPT START ---\n');
  console.log(template);
  outputText('\n--- PROMPT END ---\n');
  
  const outputDir = path.join(process.cwd(), '.kfa', 'prompts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(outputDir, promptPath.replace('/', '-') + '-' + timestamp + '.md');
  
  fs.writeFileSync(outputFile, template);
  
  outputInfo('\nSaved to: ' + outputFile);
  outputText('\nNext steps:');
  outputText('  1. Copy the prompt above');
  outputText('  2. Paste into your AI assistant');
  outputText('  3. Or use: kfa agent run "$(cat ' + outputFile + ')"');
}

module.exports = { execute };

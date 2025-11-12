const { outputSuccess, outputText, outputJSON } = require('../../lib/utils');
const fs = require('fs');
const path = require('path');

function execute(args) {
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
  const promptsDir = path.join(__dirname, '..', '..', 'prime-prompts');
  
  const categories = fs.readdirSync(promptsDir).filter(item => {
    return fs.statSync(path.join(promptsDir, item)).isDirectory();
  });
  
  const allPrompts = {};
  
  categories.forEach(category => {
    const categoryPath = path.join(promptsDir, category);
    const prompts = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
    
    allPrompts[category] = prompts;
  });
  
  if (format === 'json') {
    outputJSON(allPrompts);
  } else {
    outputSuccess('Available Prime Prompts:\n');
    
    Object.keys(allPrompts).sort().forEach(category => {
      outputText('  ' + category + ':');
      allPrompts[category].forEach(prompt => {
        outputText('    - ' + prompt);
      });
      outputText('');
    });
    
    const total = Object.values(allPrompts).reduce((sum, arr) => sum + arr.length, 0);
    outputText('Total: ' + total + ' prompts');
    outputText('\nUsage: kfa prime show <category>/<prompt>');
    outputText('       kfa prime use <category>/<prompt> "<context>"');
  }
}

module.exports = { execute };

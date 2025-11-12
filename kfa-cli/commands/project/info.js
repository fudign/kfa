const { readJSON, outputJSON, outputText, outputSuccess } = require('../../lib/utils');
const path = require('path');

function execute(args) {
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
  
  const frontendPkg = readJSON(path.join(process.cwd(), 'kfa-website', 'package.json'));
  const backendComposer = readJSON(path.join(process.cwd(), 'kfa-backend', 'kfa-api', 'composer.json'));
  
  const info = {
    name: 'KFA-6-Alpha',
    frontend: {
      name: frontendPkg ? frontendPkg.name : 'unknown',
      version: frontendPkg ? frontendPkg.version : 'unknown'
    },
    backend: {
      name: backendComposer ? backendComposer.name : 'unknown',
      version: backendComposer ? backendComposer.version : 'unknown'
    }
  };
  
  if (format === 'json') {
    outputJSON(info);
  } else {
    outputSuccess('KFA Project Information:');
    outputText('  Frontend: ' + info.frontend.name + ' v' + info.frontend.version);
    outputText('  Backend: ' + info.backend.name + ' v' + info.backend.version);
  }
}

module.exports = { execute };

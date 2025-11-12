const { DatabaseClient } = require('../../lib/database');
const { outputJSON, outputSuccess, outputError, outputText } = require('../../lib/utils');

async function execute(args) {
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
  
  const db = new DatabaseClient();
  const result = await db.backup();
  
  if (format === 'json') {
    outputJSON(result);
  } else {
    if (result.success) {
      outputSuccess(result.message);
      outputText('  File: ' + result.backupFile);
      outputText('  Size: ' + (result.size / 1024).toFixed(2) + ' KB');
    } else {
      outputError('Backup failed: ' + result.error);
    }
  }
  
  process.exit(result.success ? 0 : 1);
}

module.exports = { execute };

const { DatabaseClient } = require('../../lib/database');
const { outputJSON, outputSuccess, outputError } = require('../../lib/utils');

async function execute(args) {
  const seeder = args[0] && !args[0].startsWith('--') ? args[0] : null;
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
  
  const db = new DatabaseClient();
  const result = await db.seed(seeder);
  
  if (format === 'json') {
    outputJSON(result);
  } else {
    if (result.success) {
      outputSuccess(result.message);
    } else {
      outputError('Seeding failed: ' + result.error);
      if (result.stderr) {
        console.error(result.stderr);
      }
    }
  }
  
  process.exit(result.success ? 0 : 1);
}

module.exports = { execute };

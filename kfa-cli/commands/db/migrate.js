const { DatabaseClient } = require('../../lib/database');
const { outputJSON, outputSuccess, outputError } = require('../../lib/utils');

async function execute(args) {
  const fresh = args.includes('--fresh');
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';

  const db = new DatabaseClient();
  const result = await db.migrate({ fresh });

  if (format === 'json') {
    outputJSON(result);
  } else {
    if (result.success) {
      outputSuccess(result.message);
    } else {
      outputError('Migration failed: ' + result.error);
      if (result.stderr) {
        console.error(result.stderr);
      }
    }
  }

  process.exit(result.success ? 0 : 1);
}

module.exports = { execute };

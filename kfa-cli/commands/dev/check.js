const { DatabaseClient } = require('../../lib/database');
const { outputSuccess, outputError, outputInfo, outputJSON } = require('../../lib/utils');

async function execute(args) {
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';

  outputInfo('Checking development environment...');

  const checks = {
    database: { success: false, message: '' },
  };

  const db = new DatabaseClient();
  const dbStatus = await db.checkStatus();
  checks.database = {
    success: dbStatus.success,
    message: dbStatus.success ? 'Connected' : dbStatus.error,
  };

  if (format === 'json') {
    outputJSON(checks);
  } else {
    outputInfo('  Database: ' + checks.database.message);

    if (checks.database.success) {
      outputSuccess('Development environment ready');
    } else {
      outputError('Development environment has issues');
    }
  }

  process.exit(checks.database.success ? 0 : 1);
}

module.exports = { execute };

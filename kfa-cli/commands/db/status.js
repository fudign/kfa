const { DatabaseClient } = require('../../lib/database');
const { Cache } = require('../../lib/cache');
const { outputJSON, outputText, outputSuccess, outputError } = require('../../lib/utils');

async function execute(args) {
  const useCache = !args.includes('--no-cache');
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';

  const cache = new Cache('db', { ttl: 6 * 60 * 60 });

  if (useCache) {
    const cached = cache.get('status');
    if (cached) {
      if (format === 'json') {
        outputJSON({ ...cached, cached: true });
      } else {
        outputSuccess('Database: ' + cached.status + ' (cached)');
        outputText('  Host: ' + cached.host);
        outputText('  Database: ' + cached.database);
        outputText('  Latency: ' + cached.latency + 'ms');
      }
      return;
    }
  }

  const db = new DatabaseClient();
  const status = await db.checkStatus();

  if (useCache && status.success) {
    cache.set('status', status);
  }

  if (format === 'json') {
    outputJSON({ ...status, cached: false });
  } else {
    if (status.success) {
      outputSuccess('Database: ' + status.status);
      outputText('  Host: ' + status.host);
      outputText('  Database: ' + status.database);
      outputText('  Latency: ' + status.latency + 'ms');
    } else {
      outputError('Database: ' + status.status);
      outputText('  Error: ' + status.error);
    }
  }

  process.exit(status.success ? 0 : 1);
}

module.exports = { execute };

const { DatabaseClient } = require('../../lib/database');
const { Cache } = require('../../lib/cache');
const { outputSuccess, outputText, outputInfo } = require('../../lib/utils');

async function execute(args) {
  outputInfo('Warming cache...');
  
  outputText('  - Database status...');
  const db = new DatabaseClient();
  const dbStatus = await db.checkStatus();
  if (dbStatus.success) {
    const cache = new Cache('db', { ttl: 6 * 60 * 60 });
    cache.set('status', dbStatus);
    outputSuccess('    Cached database status');
  }
  
  outputSuccess('Cache warmed successfully');
}

module.exports = { execute };

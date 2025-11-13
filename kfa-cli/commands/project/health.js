const { DatabaseClient } = require('../../lib/database');
const { fileExists, outputSuccess, outputError, outputInfo, outputJSON } = require('../../lib/utils');
const path = require('path');

async function execute(args) {
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';

  outputInfo('Checking project health...');

  const health = {
    database: { status: 'unknown', healthy: false },
    frontend: { status: 'unknown', healthy: false },
    backend: { status: 'unknown', healthy: false },
  };

  const db = new DatabaseClient();
  const dbStatus = await db.checkStatus();
  health.database = {
    status: dbStatus.success ? 'healthy' : 'unhealthy',
    healthy: dbStatus.success,
    details: dbStatus,
  };

  health.frontend = {
    status: fileExists(path.join(process.cwd(), 'kfa-website', '.env')) ? 'configured' : 'not configured',
    healthy: fileExists(path.join(process.cwd(), 'kfa-website', '.env')),
  };

  health.backend = {
    status: fileExists(path.join(process.cwd(), 'kfa-backend', 'kfa-api', '.env')) ? 'configured' : 'not configured',
    healthy: fileExists(path.join(process.cwd(), 'kfa-backend', 'kfa-api', '.env')),
  };

  const allHealthy = health.database.healthy && health.frontend.healthy && health.backend.healthy;

  if (format === 'json') {
    outputJSON({ healthy: allHealthy, health });
  } else {
    outputInfo('  Database: ' + health.database.status);
    outputInfo('  Frontend: ' + health.frontend.status);
    outputInfo('  Backend: ' + health.backend.status);

    if (allHealthy) {
      outputSuccess('Project is healthy');
    } else {
      outputError('Project has health issues');
    }
  }

  process.exit(allHealthy ? 0 : 1);
}

module.exports = { execute };

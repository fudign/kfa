const { Observability } = require('../../lib/observability');
const { outputSuccess, outputInfo } = require('../../lib/utils');

/**
 * Clear observability data
 * Usage: kfa history clear [--all] [--days N]
 */
function execute(args) {
  const obs = new Observability();

  if (args.includes('--all')) {
    obs.clearAll();
    outputSuccess('All observability data cleared');
    outputInfo('Logs, metrics, and history have been reset');
  } else {
    // Parse days
    let days = 30;
    const daysIndex = args.indexOf('--days');
    if (daysIndex !== -1 && args[daysIndex + 1]) {
      days = parseInt(args[daysIndex + 1], 10);
      if (isNaN(days) || days < 1) {
        days = 30;
      }
    }

    obs.clearOldData(days);
    outputSuccess('Old data cleared (older than ' + days + ' days)');
  }
}

module.exports = { execute };

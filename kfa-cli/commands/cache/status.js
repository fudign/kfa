const { Cache } = require('../../lib/cache');
const { outputJSON, outputText, outputSuccess } = require('../../lib/utils');
const fs = require('fs');
const path = require('path');

function execute(args) {
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
  
  const cacheRoot = path.join(process.cwd(), '.kfa', 'cache');
  
  if (!fs.existsSync(cacheRoot)) {
    if (format === 'json') {
      outputJSON({ namespaces: [], totalSize: 0, totalEntries: 0 });
    } else {
      outputText('No cache data found');
    }
    return;
  }
  
  const namespaces = fs.readdirSync(cacheRoot);
  const allStats = {};
  let totalSize = 0;
  let totalEntries = 0;
  
  namespaces.forEach(ns => {
    const cache = new Cache(ns);
    const stats = cache.stats();
    allStats[ns] = stats;
    totalSize += stats.totalSize;
    totalEntries += stats.totalEntries;
  });
  
  if (format === 'json') {
    outputJSON({ namespaces: allStats, totalSize, totalEntries });
  } else {
    outputSuccess('Cache Status:');
    outputText('');
    namespaces.forEach(ns => {
      const stats = allStats[ns];
      outputText('  ' + ns + ':');
      outputText('    Entries: ' + stats.validEntries + ' valid, ' + stats.expiredEntries + ' expired');
      outputText('    Size: ' + (stats.totalSize / 1024).toFixed(2) + ' KB');
      outputText('    TTL: ' + (stats.ttl / 3600).toFixed(1) + ' hours');
    });
    outputText('');
    outputText('  Total: ' + totalEntries + ' entries, ' + (totalSize / 1024).toFixed(2) + ' KB');
  }
}

module.exports = { execute };

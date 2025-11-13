const { Cache } = require('../../lib/cache');
const { outputSuccess, outputText } = require('../../lib/utils');
const fs = require('fs');
const path = require('path');

function execute(args) {
  const namespace = args[0] && !args[0].startsWith('--') ? args[0] : null;

  if (namespace) {
    const cache = new Cache(namespace);
    cache.clear();
    outputSuccess('Cache cleared for namespace: ' + namespace);
  } else {
    const cacheRoot = path.join(process.cwd(), '.kfa', 'cache');
    if (fs.existsSync(cacheRoot)) {
      const namespaces = fs.readdirSync(cacheRoot);
      namespaces.forEach((ns) => {
        const cache = new Cache(ns);
        cache.clear();
      });
      outputSuccess('All caches cleared');
      outputText('  Namespaces: ' + namespaces.join(', '));
    } else {
      outputText('No cache to clear');
    }
  }
}

module.exports = { execute };

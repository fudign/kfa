#!/usr/bin/env node
/**
 * Cache Status - Simple Version
 * Shows cache statistics without complex Cache class
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const format = args.includes('--json') ? 'json' : 'text';
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

const cacheBaseDir = path.join(process.cwd(), '.kfa', 'cache');

function getCacheStats(namespace) {
  const cacheDir = path.join(cacheBaseDir, namespace);

  if (!fs.existsSync(cacheDir)) {
    return {
      namespace,
      totalEntries: 0,
      validEntries: 0,
      expiredEntries: 0,
      totalSize: 0,
    };
  }

  const files = fs.readdirSync(cacheDir);
  let totalSize = 0;
  let validCount = 0;
  let expiredCount = 0;

  files.forEach((file) => {
    const filepath = path.join(cacheDir, file);
    try {
      const stats = fs.statSync(filepath);
      totalSize += stats.size;

      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      if (Date.now() > data.expires) {
        expiredCount++;
      } else {
        validCount++;
      }
    } catch {
      expiredCount++;
    }
  });

  return {
    namespace,
    totalEntries: files.length,
    validEntries: validCount,
    expiredEntries: expiredCount,
    totalSize,
  };
}

try {
  if (!fs.existsSync(cacheBaseDir)) {
    const result = { message: 'No cache found', caches: [] };
    const output = format === 'json' ? JSON.stringify(result, null, 2) : '✓ Cache Status: Empty (no caches yet)';

    if (outputFile) {
      fs.writeFileSync(outputFile, output);
      console.log(`✓ Output: ${outputFile}`);
    } else {
      console.log(output);
    }
    process.exit(0);
  }

  // Get all cache namespaces
  const namespaces = fs.readdirSync(cacheBaseDir).filter((name) => {
    return fs.statSync(path.join(cacheBaseDir, name)).isDirectory();
  });

  const caches = namespaces.map(getCacheStats);
  const totalSize = caches.reduce((sum, c) => sum + c.totalSize, 0);
  const totalEntries = caches.reduce((sum, c) => sum + c.totalEntries, 0);
  const validEntries = caches.reduce((sum, c) => sum + c.validEntries, 0);

  const result = {
    totalSize,
    totalEntries,
    validEntries,
    caches,
    timestamp: new Date().toISOString(),
  };

  const output =
    format === 'json'
      ? JSON.stringify(result, null, 2)
      : `✓ Cache Status\n` +
        `  Total Size: ${(totalSize / 1024).toFixed(2)} KB\n` +
        `  Total Entries: ${totalEntries}\n` +
        `  Valid: ${validEntries}\n` +
        `  Namespaces: ${namespaces.join(', ')}`;

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`✓ Output: ${outputFile}`);
  } else {
    console.log(output);
  }

  process.exit(0);
} catch (error) {
  const output = format === 'json' ? JSON.stringify({ error: error.message }, null, 2) : `✗ Error: ${error.message}`;

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
  } else {
    console.error(output);
  }

  process.exit(1);
}

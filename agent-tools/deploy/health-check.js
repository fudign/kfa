#!/usr/bin/env node
/**
 * Health Check Tool
 * Verifies deployed application health
 */

const https = require('https');
const http = require('http');

const args = process.argv.slice(2);
const urlArg = args.find((a) => a.startsWith('--url='));

if (!urlArg) {
  console.error(
    JSON.stringify(
      {
        success: false,
        error: 'Missing --url parameter',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const url = urlArg.split('=')[1];
const urlObj = new URL(url);
const protocol = urlObj.protocol === 'https:' ? https : http;

const startTime = Date.now();

const req = protocol.get(url, (res) => {
  const responseTime = Date.now() - startTime;
  let body = '';

  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    const result = {
      success: res.statusCode >= 200 && res.statusCode < 300,
      timestamp: new Date().toISOString(),
      url,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      responseTime: `${responseTime}ms`,
      contentType: res.headers['content-type'],
      contentLength: res.headers['content-length'],
    };

    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  });
});

req.on('error', (error) => {
  const result = {
    success: false,
    timestamp: new Date().toISOString(),
    url,
    error: error.message,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(1);
});

req.setTimeout(10000, () => {
  req.destroy();
  console.error(
    JSON.stringify(
      {
        success: false,
        timestamp: new Date().toISOString(),
        url,
        error: 'Request timeout (10s)',
      },
      null,
      2,
    ),
  );
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Railway Deployment Status Tool
 * Checks deployment status via Railway API or health endpoint
 */

const https = require('https');
const http = require('http');
require('dotenv').config();

const args = process.argv.slice(2);
const urlArg = args.find((a) => a.startsWith('--url='));
const projectArg = args.find((a) => a.startsWith('--project='));

// Get Railway URL from env or args
const railwayUrl =
  urlArg?.split('=')[1] || process.env.RAILWAY_URL || process.env.KFA_BACKEND_URL || 'https://kfa-production.up.railway.app';

const projectName = projectArg?.split('=')[1] || 'kfa-backend';

async function checkDeployment() {
  const startTime = Date.now();
  const urlObj = new URL(railwayUrl);
  const protocol = urlObj.protocol === 'https:' ? https : http;

  return new Promise((resolve) => {
    const req = protocol.get(railwayUrl, (res) => {
      const responseTime = Date.now() - startTime;
      let body = '';

      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const result = {
          success: res.statusCode >= 200 && res.statusCode < 300,
          timestamp: new Date().toISOString(),
          project: projectName,
          url: railwayUrl,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          responseTime: `${responseTime}ms`,
          contentType: res.headers['content-type'],
          serverHeader: res.headers['server'],
          deployed: res.statusCode < 500,
        };

        console.log(JSON.stringify(result, null, 2));
        process.exit(result.success ? 0 : 1);
      });
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      const result = {
        success: false,
        timestamp: new Date().toISOString(),
        project: projectName,
        url: railwayUrl,
        responseTime: `${responseTime}ms`,
        deployed: false,
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
            project: projectName,
            url: railwayUrl,
            deployed: false,
            error: 'Request timeout (10s)',
          },
          null,
          2,
        ),
      );
      process.exit(1);
    });
  });
}

checkDeployment();

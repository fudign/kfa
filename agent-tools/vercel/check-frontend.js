#!/usr/bin/env node
/**
 * Vercel Frontend Status Tool
 * Checks if Vercel frontend deployment is live
 */

const https = require('https');
const http = require('http');
require('dotenv').config();

const args = process.argv.slice(2);
const urlArg = args.find((a) => a.startsWith('--url='));

// Get Vercel URL from env or args
const vercelUrl = urlArg?.split('=')[1] || process.env.VERCEL_URL || process.env.KFA_FRONTEND_URL || 'https://kfa-website.vercel.app';

async function checkFrontend() {
  const startTime = Date.now();
  const urlObj = new URL(vercelUrl);
  const protocol = urlObj.protocol === 'https:' ? https : http;

  return new Promise((resolve) => {
    const req = protocol.get(vercelUrl, (res) => {
      const responseTime = Date.now() - startTime;
      let body = '';

      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const result = {
          success: res.statusCode >= 200 && res.statusCode < 300,
          timestamp: new Date().toISOString(),
          project: 'kfa-website',
          url: vercelUrl,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          responseTime: `${responseTime}ms`,
          contentType: res.headers['content-type'],
          serverHeader: res.headers['server'],
          vercelCache: res.headers['x-vercel-cache'],
          vercelId: res.headers['x-vercel-id'],
          deployed: res.statusCode < 500,
          isHtml: res.headers['content-type']?.includes('text/html'),
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
        project: 'kfa-website',
        url: vercelUrl,
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
            project: 'kfa-website',
            url: vercelUrl,
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

checkFrontend();

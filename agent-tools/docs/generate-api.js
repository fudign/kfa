#!/usr/bin/env node
/**
 * API Documentation Generator
 * Extracts Laravel routes and generates docs
 */

const { exec } = require('child_process');
const path = require('path');

const backendPath = path.join(__dirname, '../../kfa-backend/kfa-api');
const cmd = `cd "${backendPath}" && php artisan route:list --json`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(
      JSON.stringify(
        {
          success: false,
          error: stderr || error.message,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  try {
    const routes = JSON.parse(stdout);

    // Group routes by prefix
    const grouped = {};
    routes.forEach((route) => {
      const prefix = route.uri.split('/')[0] || 'root';
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(route);
    });

    // Generate markdown
    let markdown = '# API Documentation\n\n';
    markdown += `Generated: ${new Date().toISOString()}\n\n`;

    for (const [prefix, routes] of Object.entries(grouped)) {
      markdown += `## ${prefix}\n\n`;
      routes.forEach((route) => {
        markdown += `### ${route.method} /${route.uri}\n`;
        if (route.name) markdown += `**Name:** ${route.name}\n`;
        if (route.action) markdown += `**Action:** ${route.action}\n`;
        markdown += '\n';
      });
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      routeCount: routes.length,
      groups: Object.keys(grouped),
      markdown,
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (parseError) {
    console.error(
      JSON.stringify(
        {
          success: false,
          error: 'Failed to parse route list',
          details: parseError.message,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
});

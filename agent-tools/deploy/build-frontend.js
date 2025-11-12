#!/usr/bin/env node
/**
 * Frontend Build Tool
 * Builds React app for production
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const frontendPath = path.join(__dirname, '../../kfa-website');

exec(`cd "${frontendPath}" && npm run build`, (error, stdout, stderr) => {
  const distPath = path.join(frontendPath, 'dist');
  const distExists = fs.existsSync(distPath);

  let size = 0;
  if (distExists) {
    const getSize = (dir) => {
      let total = 0;
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
          total += getSize(filePath);
        } else {
          total += fs.statSync(filePath).size;
        }
      }
      return total;
    };
    size = getSize(distPath);
  }

  const result = {
    success: !error && distExists,
    timestamp: new Date().toISOString(),
    distPath,
    distSize: size,
    distSizeMB: (size / 1024 / 1024).toFixed(2),
    output: stdout,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});

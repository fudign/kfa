const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function outputJSON(data) {
  console.log(JSON.stringify(data, null, 2));
}

function outputText(text) {
  console.log(text);
}

function outputSuccess(message) {
  console.log('\u001b[32m\u2713\u001b[0m ' + message);
}

function outputError(message) {
  console.error('\u001b[31m\u2717\u001b[0m ' + message);
}

function outputWarning(message) {
  console.log('\u001b[33m\u26A0\u001b[0m ' + message);
}

function outputInfo(message) {
  console.log('\u001b[36m\u2139\u001b[0m ' + message);
}

function execCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

function readJSON(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function writeJSON(filepath, data) {
  try {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

function fileExists(filepath) {
  try {
    return fs.existsSync(filepath);
  } catch {
    return false;
  }
}

function ensureDir(dirpath) {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
}

function getTimestamp() {
  return new Date().toISOString();
}

function formatDuration(ms) {
  if (ms < 1000) return ms + 'ms';
  if (ms < 60000) return (ms / 1000).toFixed(2) + 's';
  return (ms / 60000).toFixed(2) + 'm';
}

function parseArgs(args) {
  const parsed = {
    flags: {},
    positional: [],
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        parsed.flags[key] = args[i + 1];
        i++;
      } else {
        parsed.flags[key] = true;
      }
    } else if (arg.startsWith('-')) {
      parsed.flags[arg.slice(1)] = true;
    } else {
      parsed.positional.push(arg);
    }
  }
  return parsed;
}

function parseFormat(args) {
  const formatIndex = args.indexOf('--format');
  if (formatIndex !== -1 && args[formatIndex + 1]) {
    return args[formatIndex + 1];
  }
  return 'text';
}

module.exports = {
  outputJSON,
  outputText,
  outputSuccess,
  outputError,
  outputWarning,
  outputInfo,
  execCommand,
  readJSON,
  writeJSON,
  fileExists,
  ensureDir,
  getTimestamp,
  formatDuration,
  parseArgs,
  parseFormat,
};

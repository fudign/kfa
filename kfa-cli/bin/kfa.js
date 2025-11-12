#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');
const VERSION = '1.0.0';

// Import observability
const { Observability } = require('../lib/observability');

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log('kfa v' + VERSION);
    process.exit(0);
  }

  const category = args[0];
  const subcommand = args[1];
  const rest = args.slice(2);

  if (!category) {
    console.error('Error: Command category required');
    console.error('Run kfa --help for usage information.');
    process.exit(1);
  }

  if (!subcommand) {
    console.error('Error: Subcommand required for ' + category);
    console.error('Run kfa ' + category + ' --help for available subcommands.');
    process.exit(1);
  }

  if (subcommand === '--help' || subcommand === '-h') {
    showCategoryHelp(category);
    process.exit(0);
  }

  const commandPath = path.join(COMMANDS_DIR, category, subcommand + '.js');

  if (!fs.existsSync(commandPath)) {
    console.error('Error: Unknown command kfa ' + category + ' ' + subcommand);
    console.error('Run kfa --help for usage information.');
    process.exit(1);
  }

  // Initialize observability
  const obs = new Observability();
  const commandName = category + ' ' + subcommand;
  const startTime = Date.now();

  try {
    const command = require(commandPath);
    if (typeof command.execute !== 'function') {
      throw new Error('Command module must export an execute function');
    }

    // Execute command
    const result = command.execute(rest);
    const duration = Date.now() - startTime;

    // Log successful execution
    obs.logCommand(commandName, rest, { success: true, output: '' }, duration);

  } catch (error) {
    const duration = Date.now() - startTime;

    // Log error
    obs.logError(commandName + ' ' + rest.join(' '), error);
    obs.logCommand(
      commandName,
      rest,
      { success: false, error: error.message },
      duration
    );

    console.error('Error executing command: ' + error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function showHelp() {
  const README_PATH = path.join(__dirname, '..', 'README.md');
  if (fs.existsSync(README_PATH)) {
    const readme = fs.readFileSync(README_PATH, 'utf8');
    console.log(readme);
  } else {
    console.log('KFA CLI v' + VERSION + ' - Unified command-line interface\n');
    console.log('Usage: kfa <command> [subcommand] [options]\n');
    console.log('Commands:');
    console.log('  db        Database operations');
    console.log('  test      Testing utilities');
    console.log('  deploy    Deployment helpers');
    console.log('  dev       Development tools');
    console.log('  cache     Cache management');
    console.log('  project   Project information\n');
  }
}

function showCategoryHelp(category) {
  const categoryPath = path.join(COMMANDS_DIR, category);
  if (!fs.existsSync(categoryPath)) {
    console.error('Error: Unknown command category ' + category);
    process.exit(1);
  }
  const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
  const subcommands = files.map(f => f.replace('.js', '')).join(', ');
  console.log('kfa ' + category + ' - Available subcommands: ' + subcommands);
}

main();

const { Observability } = require('../../lib/observability');
const { parseFormat, outputInfo, outputSuccess, outputError } = require('../../lib/utils');

/**
 * Show command execution history
 * Usage: kfa history show [--type commands|agents|errors] [--limit N] [--format json]
 */
function execute(args) {
  const format = parseFormat(args);

  // Parse type
  let type = 'commands';
  const typeIndex = args.indexOf('--type');
  if (typeIndex !== -1 && args[typeIndex + 1]) {
    type = args[typeIndex + 1];
  }

  // Parse limit
  let limit = 20;
  const limitIndex = args.indexOf('--limit');
  if (limitIndex !== -1 && args[limitIndex + 1]) {
    limit = parseInt(args[limitIndex + 1], 10);
    if (isNaN(limit) || limit < 1) {
      limit = 20;
    }
  }

  const obs = new Observability();
  let history = [];

  if (type === 'commands') {
    history = obs.getCommandHistory(limit);
  } else if (type === 'agents') {
    history = obs.getAgentHistory(limit);
  } else if (type === 'errors') {
    history = obs.getErrorHistory(limit);
  } else {
    outputError('Invalid type: ' + type);
    outputInfo('Valid types: commands, agents, errors');
    process.exit(1);
  }

  if (format === 'json') {
    console.log(JSON.stringify({ type, limit, history }, null, 2));
  } else {
    displayHistoryText(type, history, limit);
  }
}

function displayHistoryText(type, history, limit) {
  console.log('');
  outputSuccess('History: ' + type + ' (last ' + limit + ')');
  console.log('');

  if (history.length === 0) {
    outputInfo('No history found');
    console.log('');
    return;
  }

  if (type === 'commands') {
    displayCommandsHistory(history);
  } else if (type === 'agents') {
    displayAgentsHistory(history);
  } else if (type === 'errors') {
    displayErrorsHistory(history);
  }
}

function displayCommandsHistory(history) {
  history.forEach((entry, index) => {
    const status = entry.success ? '\u001b[32m✓\u001b[0m' : '\u001b[31m✗\u001b[0m';
    const timestamp = formatTimestamp(entry.timestamp);
    const duration = entry.duration.toFixed(0) + 'ms';
    const argsStr = entry.args && entry.args.length > 0
      ? ' ' + entry.args.join(' ')
      : '';

    console.log(
      status + ' ' +
      timestamp + ' ' +
      entry.command + argsStr +
      ' (' + duration + ')'
    );

    if (!entry.success && entry.error) {
      console.log('   Error: ' + entry.error);
    }
  });
  console.log('');
}

function displayAgentsHistory(history) {
  history.forEach((entry, index) => {
    const status = entry.success ? '\u001b[32m✓\u001b[0m' : '\u001b[31m✗\u001b[0m';
    const timestamp = formatTimestamp(entry.timestamp);
    const duration = entry.duration.toFixed(0) + 'ms';
    const prompt = truncate(entry.prompt, 60);

    console.log(
      status + ' ' +
      timestamp + ' ' +
      '"' + prompt + '"' +
      ' (' + duration + ')'
    );

    if (entry.tokensUsed) {
      console.log('   Tokens: ' + entry.tokensUsed.toLocaleString());
    }

    if (entry.cost) {
      console.log('   Cost: $' + entry.cost.toFixed(4));
    }

    if (entry.sessionId) {
      console.log('   Session: ' + entry.sessionId);
    }
  });
  console.log('');
}

function displayErrorsHistory(history) {
  history.forEach((entry, index) => {
    const timestamp = formatTimestamp(entry.timestamp);
    console.log('\u001b[31m✗\u001b[0m ' + timestamp + ' ' + entry.context);
    console.log('   Error: ' + entry.error);

    if (entry.code) {
      console.log('   Code: ' + entry.code);
    }
  });
  console.log('');
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return diffMins + 'm ago';
  } else if (diffHours < 24) {
    return diffHours + 'h ago';
  } else if (diffDays < 7) {
    return diffDays + 'd ago';
  } else {
    return date.toISOString().split('T')[0];
  }
}

function truncate(str, maxLength) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

module.exports = { execute };

const { Observability } = require('../../lib/observability');
const { parseFormat, outputInfo, outputSuccess, outputText } = require('../../lib/utils');

/**
 * Show project metrics
 * Usage: kfa project metrics [--period today|week|month] [--format json]
 */
function execute(args) {
  const format = parseFormat(args);

  // Parse period
  let period = 'today';
  const periodIndex = args.indexOf('--period');
  if (periodIndex !== -1 && args[periodIndex + 1]) {
    period = args[periodIndex + 1];
  }

  const obs = new Observability();
  const metricsData = obs.getMetrics(period);
  const cacheStats = obs.getCacheStats();

  if (format === 'json') {
    console.log(
      JSON.stringify(
        {
          period,
          metrics: metricsData,
          cache: cacheStats,
        },
        null,
        2
      )
    );
  } else {
    displayMetricsText(metricsData, cacheStats, period);
  }
}

function displayMetricsText(metricsData, cacheStats, period) {
  const metrics = metricsData.data || {};

  console.log('');
  outputSuccess('KFA Project Metrics (' + period + ')');
  console.log('');

  // Commands section
  if (metrics.command && Object.keys(metrics.command).length > 0) {
    outputInfo('Commands:');
    Object.entries(metrics.command).forEach(([cmd, data]) => {
      const successRate = data.count > 0
        ? ((data.successCount || 0) / data.count * 100).toFixed(1)
        : '0.0';

      console.log(
        '  ' + cmd +
        ': ' + data.count + ' runs' +
        ', avg ' + data.avgDuration.toFixed(0) + 'ms' +
        ', success ' + successRate + '%'
      );
    });
    console.log('');
  }

  // Agent runs section
  if (metrics.agent && metrics.agent.run) {
    const agentData = metrics.agent.run;
    outputInfo('Agent Runs:');
    console.log('  Total: ' + (agentData.count || 0) + ' runs');
    console.log('  Avg Duration: ' + (agentData.avgDuration || 0).toFixed(0) + 'ms');

    if (agentData.tokensUsed) {
      console.log('  Total Tokens: ' + agentData.tokensUsed.toLocaleString());
    }

    if (agentData.cost) {
      console.log('  Total Cost: $' + agentData.cost.toFixed(4));
    }

    const agentSuccessRate = agentData.count > 0
      ? ((agentData.successCount || 0) / agentData.count * 100).toFixed(1)
      : '0.0';
    console.log('  Success Rate: ' + agentSuccessRate + '%');
    console.log('');
  }

  // Cache section
  outputInfo('Cache:');
  console.log('  Total Size: ' + formatBytes(cacheStats.size));
  console.log('  Total Files: ' + cacheStats.files);

  if (cacheStats.namespaces && cacheStats.namespaces.length > 0) {
    console.log('  Namespaces:');
    cacheStats.namespaces.forEach((ns) => {
      console.log(
        '    ' + ns.namespace + ': ' + ns.files + ' files (' +
        formatBytes(ns.size) + ')'
      );
    });
  }
  console.log('');

  // Errors section
  if (metrics.errors && Object.keys(metrics.errors).length > 0) {
    outputInfo('Errors:');
    Object.entries(metrics.errors).forEach(([context, data]) => {
      console.log('  ' + context + ': ' + (data.count || 0) + ' errors');
    });
    console.log('');
  }

  // Summary
  const totalCommands = Object.values(metrics.command || {}).reduce(
    (sum, data) => sum + data.count,
    0
  );
  const totalAgentRuns = (metrics.agent && metrics.agent.run)
    ? metrics.agent.run.count || 0
    : 0;
  const totalErrors = Object.values(metrics.errors || {}).reduce(
    (sum, data) => sum + (data.count || 0),
    0
  );

  outputInfo('Summary:');
  console.log('  Total Operations: ' + (totalCommands + totalAgentRuns));
  console.log('  Total Commands: ' + totalCommands);
  console.log('  Total Agent Runs: ' + totalAgentRuns);
  console.log('  Total Errors: ' + totalErrors);
  console.log('');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

module.exports = { execute };

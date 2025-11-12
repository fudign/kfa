const fs = require('fs');
const path = require('path');

/**
 * Observability system for KFA CLI
 * Tracks command execution, metrics, and errors
 */
class Observability {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.kfaDir = path.join(this.projectRoot, '.kfa');
    this.logsDir = path.join(this.kfaDir, 'logs');
    this.metricsDir = path.join(this.kfaDir, 'metrics');
    this.historyDir = path.join(this.kfaDir, 'history');

    // Create directories if they don't exist
    this._ensureDirectories();
  }

  /**
   * Ensure all required directories exist
   */
  _ensureDirectories() {
    const dirs = [
      this.kfaDir,
      this.logsDir,
      this.metricsDir,
      this.historyDir,
      path.join(this.logsDir, 'agent'),
      path.join(this.logsDir, 'db'),
      path.join(this.logsDir, 'deploy'),
      path.join(this.logsDir, 'errors'),
      path.join(this.metricsDir, 'daily'),
      path.join(this.metricsDir, 'weekly'),
    ];

    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Log command execution
   * @param {string} command - Command name (e.g., "db status")
   * @param {Array} args - Command arguments
   * @param {Object} result - Execution result
   * @param {number} duration - Execution duration in ms
   */
  logCommand(command, args, result, duration) {
    const entry = {
      timestamp: new Date().toISOString(),
      command,
      args,
      success: result.success !== false,
      duration,
      output: this._truncate(result.output, 500),
      error: result.error || null,
    };

    // Append to commands history
    this._appendToJSONL(path.join(this.historyDir, 'commands.jsonl'), entry);

    // Update metrics
    this._updateMetrics('command', command, duration, {
      success: entry.success,
    });

    // Log to category-specific log file
    const category = command.split(' ')[0];
    if (['agent', 'db', 'deploy'].includes(category)) {
      this._writeLog(category, command, entry);
    }
  }

  /**
   * Log agent execution
   * @param {string} prompt - Agent prompt
   * @param {Object} result - Execution result
   * @param {number} duration - Duration in ms
   */
  logAgent(prompt, result, duration) {
    const entry = {
      timestamp: new Date().toISOString(),
      prompt: this._truncate(prompt, 200),
      success: result.success !== false,
      duration,
      tokensUsed: result.tokensUsed || null,
      cost: result.cost || null,
      sessionId: result.sessionId || null,
    };

    // Append to agent runs history
    this._appendToJSONL(path.join(this.historyDir, 'agent-runs.jsonl'), entry);

    // Update metrics
    this._updateMetrics('agent', 'run', duration, {
      tokensUsed: entry.tokensUsed,
      cost: entry.cost,
      success: entry.success,
    });

    // Log to agent log file
    this._writeLog('agent', 'agent-run', entry);
  }

  /**
   * Log error
   * @param {string} context - Error context
   * @param {Error} error - Error object
   */
  logError(context, error) {
    const entry = {
      timestamp: new Date().toISOString(),
      context,
      error: error.message,
      stack: error.stack,
      code: error.code || null,
    };

    // Append to errors history
    this._appendToJSONL(path.join(this.historyDir, 'errors.jsonl'), entry);

    // Write detailed error log
    const errorLog = path.join(
      this.logsDir,
      'errors',
      Date.now() + '.log'
    );
    fs.writeFileSync(errorLog, JSON.stringify(entry, null, 2));

    // Update error metrics
    this._updateMetrics('errors', context.split(' ')[0], 0, {
      count: 1,
    });
  }

  /**
   * Get metrics for a period
   * @param {string} period - 'today', 'week', 'month'
   * @returns {Object} Metrics data
   */
  getMetrics(period = 'today') {
    if (period === 'today') {
      return this._getTodayMetrics();
    } else if (period === 'week') {
      return this._getWeekMetrics();
    } else if (period === 'month') {
      return this._getMonthMetrics();
    }
    return {};
  }

  /**
   * Get today's metrics
   */
  _getTodayMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const metricsFile = path.join(this.metricsDir, 'daily', today + '.json');

    if (!fs.existsSync(metricsFile)) {
      return { date: today, data: {} };
    }

    const metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
    return { date: today, data: metrics };
  }

  /**
   * Get week's metrics (last 7 days)
   */
  _getWeekMetrics() {
    const metrics = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const metricsFile = path.join(this.metricsDir, 'daily', dateStr + '.json');
      if (fs.existsSync(metricsFile)) {
        const data = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
        metrics.push({ date: dateStr, data });
      }
    }

    return { period: 'week', metrics };
  }

  /**
   * Get month's metrics (last 30 days)
   */
  _getMonthMetrics() {
    const metrics = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const metricsFile = path.join(this.metricsDir, 'daily', dateStr + '.json');
      if (fs.existsSync(metricsFile)) {
        const data = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
        metrics.push({ date: dateStr, data });
      }
    }

    return { period: 'month', metrics };
  }

  /**
   * Get command history
   * @param {number} limit - Max number of entries
   * @returns {Array} Command history
   */
  getCommandHistory(limit = 50) {
    const historyFile = path.join(this.historyDir, 'commands.jsonl');

    if (!fs.existsSync(historyFile)) {
      return [];
    }

    const lines = fs.readFileSync(historyFile, 'utf8').trim().split('\n');
    const entries = lines
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))
      .reverse(); // Most recent first

    return entries.slice(0, limit);
  }

  /**
   * Get agent run history
   * @param {number} limit - Max number of entries
   * @returns {Array} Agent run history
   */
  getAgentHistory(limit = 50) {
    const historyFile = path.join(this.historyDir, 'agent-runs.jsonl');

    if (!fs.existsSync(historyFile)) {
      return [];
    }

    const lines = fs.readFileSync(historyFile, 'utf8').trim().split('\n');
    const entries = lines
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))
      .reverse();

    return entries.slice(0, limit);
  }

  /**
   * Get error history
   * @param {number} limit - Max number of entries
   * @returns {Array} Error history
   */
  getErrorHistory(limit = 50) {
    const historyFile = path.join(this.historyDir, 'errors.jsonl');

    if (!fs.existsSync(historyFile)) {
      return [];
    }

    const lines = fs.readFileSync(historyFile, 'utf8').trim().split('\n');
    const entries = lines
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))
      .reverse();

    return entries.slice(0, limit);
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    const cacheDir = path.join(this.kfaDir, 'cache');

    if (!fs.existsSync(cacheDir)) {
      return { size: 0, files: 0, namespaces: [] };
    }

    let totalSize = 0;
    let totalFiles = 0;
    const namespaces = [];

    // Walk through cache directories
    const dirs = fs.readdirSync(cacheDir);
    dirs.forEach((namespace) => {
      const nsDir = path.join(cacheDir, namespace);
      if (fs.statSync(nsDir).isDirectory()) {
        const files = fs.readdirSync(nsDir);
        let nsSize = 0;

        files.forEach((file) => {
          const filePath = path.join(nsDir, file);
          const stat = fs.statSync(filePath);
          nsSize += stat.size;
          totalFiles++;
        });

        totalSize += nsSize;
        namespaces.push({
          namespace,
          files: files.length,
          size: nsSize,
        });
      }
    });

    return {
      size: totalSize,
      files: totalFiles,
      namespaces,
    };
  }

  /**
   * Append entry to JSONL file
   */
  _appendToJSONL(filepath, entry) {
    try {
      fs.appendFileSync(filepath, JSON.stringify(entry) + '\n');
    } catch (err) {
      // Silent fail - don't break command execution
    }
  }

  /**
   * Write to log file
   */
  _writeLog(category, name, entry) {
    try {
      const logFile = path.join(
        this.logsDir,
        category,
        new Date().toISOString().split('T')[0] + '.log'
      );

      const logEntry = '[' + entry.timestamp + '] ' + name + ': ' +
        JSON.stringify(entry) + '\n';

      fs.appendFileSync(logFile, logEntry);
    } catch (err) {
      // Silent fail
    }
  }

  /**
   * Update metrics
   */
  _updateMetrics(category, operation, duration, extra = {}) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const metricsFile = path.join(this.metricsDir, 'daily', today + '.json');

      let metrics = {};
      if (fs.existsSync(metricsFile)) {
        metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
      }

      if (!metrics[category]) {
        metrics[category] = {};
      }

      if (!metrics[category][operation]) {
        metrics[category][operation] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          successCount: 0,
          failureCount: 0,
        };
      }

      const op = metrics[category][operation];
      op.count++;
      op.totalDuration += duration;
      op.avgDuration = op.totalDuration / op.count;

      if (extra.success !== false) {
        op.successCount = (op.successCount || 0) + 1;
      } else {
        op.failureCount = (op.failureCount || 0) + 1;
      }

      // Merge extra data (tokens, cost, etc.)
      Object.keys(extra).forEach((key) => {
        if (key !== 'success' && extra[key] !== null && extra[key] !== undefined) {
          if (typeof extra[key] === 'number') {
            op[key] = (op[key] || 0) + extra[key];
          } else {
            op[key] = extra[key];
          }
        }
      });

      fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));
    } catch (err) {
      // Silent fail
    }
  }

  /**
   * Truncate string to max length
   */
  _truncate(str, maxLength) {
    if (!str) return '';
    if (typeof str !== 'string') str = String(str);
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }

  /**
   * Clear all observability data
   */
  clearAll() {
    const dirs = [this.logsDir, this.metricsDir, this.historyDir];
    dirs.forEach((dir) => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
    this._ensureDirectories();
  }

  /**
   * Clear old data (older than specified days)
   */
  clearOldData(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    // Clear old daily metrics
    const dailyDir = path.join(this.metricsDir, 'daily');
    if (fs.existsSync(dailyDir)) {
      fs.readdirSync(dailyDir).forEach((file) => {
        const date = file.replace('.json', '');
        if (date < cutoffStr) {
          fs.unlinkSync(path.join(dailyDir, file));
        }
      });
    }

    // Clear old error logs
    const errorsDir = path.join(this.logsDir, 'errors');
    if (fs.existsSync(errorsDir)) {
      fs.readdirSync(errorsDir).forEach((file) => {
        const filePath = path.join(errorsDir, file);
        const stat = fs.statSync(filePath);
        if (stat.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
        }
      });
    }
  }
}

module.exports = { Observability };

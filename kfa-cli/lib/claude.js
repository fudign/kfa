/**
 * Claude Code / ADW integration for KFA CLI
 */

const { spawn } = require('child_process');
const path = require('path');
const { getProjectRoot, fileExists } = require('./utils');

class ClaudeAgent {
  constructor(options = {}) {
    this.projectRoot = getProjectRoot();
    this.adwPath = path.join(this.projectRoot, 'adws');
    this.outputDir = options.outputDir || path.join(this.projectRoot, '.kfa', 'agents');
  }

  /**
   * Run ad-hoc prompt through ADW
   *
   * @param {string} prompt - Prompt to execute
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result
   */
  async run(prompt, options = {}) {
    const script = path.join(this.adwPath, 'adw_prompt.py');

    if (!fileExists(script)) {
      throw new Error(`ADW not found at ${script}. Please ensure adws/ directory exists.`);
    }

    return this._executePython(script, [prompt], options);
  }

  /**
   * Run workflow implementation
   *
   * @param {string} context - Context or task description
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result
   */
  async implement(context, options = {}) {
    const script = path.join(this.adwPath, 'adw_chore_implement.py');

    if (!fileExists(script)) {
      throw new Error(`ADW implement script not found at ${script}`);
    }

    return this._executePython(script, [context], options);
  }

  /**
   * Run slash command
   *
   * @param {string} command - Slash command to execute
   * @param {Array} args - Command arguments
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result
   */
  async slashCommand(command, args = [], options = {}) {
    const script = path.join(this.adwPath, 'adw_slash_command.py');

    if (!fileExists(script)) {
      throw new Error(`ADW slash command script not found at ${script}`);
    }

    const fullArgs = [command, ...args];
    return this._executePython(script, fullArgs, options);
  }

  /**
   * List available workflows
   *
   * @returns {Array} List of workflows
   */
  getWorkflows() {
    const bmadPath = path.join(this.projectRoot, 'bmad');
    const workflows = [];

    // Scan BMAD modules for workflows
    const modules = ['core', 'bmb', 'bmd', 'bmm', 'kfa'];

    for (const module of modules) {
      const modulePath = path.join(bmadPath, module, 'workflows');

      if (!fileExists(modulePath)) {
        continue;
      }

      try {
        const fs = require('fs');
        const items = fs.readdirSync(modulePath);

        for (const item of items) {
          const itemPath = path.join(modulePath, item);
          const stat = fs.statSync(itemPath);

          if (stat.isDirectory()) {
            workflows.push({
              module,
              name: item,
              path: itemPath,
              fullName: `${module}:${item}`,
            });
          }
        }
      } catch (error) {
        // Skip on error
      }
    }

    return workflows;
  }

  /**
   * Execute Python script
   *
   * @private
   * @param {string} script - Script path
   * @param {Array} args - Script arguments
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result
   */
  async _executePython(script, args, options) {
    return new Promise((resolve, reject) => {
      const proc = spawn('python', [script, ...args], {
        cwd: this.projectRoot,
        env: { ...process.env, ...options.env },
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;

        if (options.onProgress) {
          options.onProgress(chunk);
        }
      });

      proc.stderr.on('data', (data) => {
        const chunk = data.toString();
        stderr += chunk;

        if (options.onProgress) {
          options.onProgress(chunk);
        }
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            output: stdout,
            stderr: stderr,
          });
        } else {
          reject(new Error(`Python script failed with code ${code}\n${stderr || stdout}`));
        }
      });

      proc.on('error', (error) => {
        reject(new Error(`Failed to execute Python script: ${error.message}`));
      });
    });
  }

  /**
   * Check if ADW is available
   *
   * @returns {boolean} True if ADW is available
   */
  isAvailable() {
    const script = path.join(this.adwPath, 'adw_prompt.py');
    return fileExists(script);
  }
}

module.exports = { ClaudeAgent };

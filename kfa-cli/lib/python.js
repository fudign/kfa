const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Python execution adapter for KFA CLI
 * Provides interface to run ADW Python scripts from Node.js
 */
class PythonAdapter {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.adwsDir = path.join(this.projectRoot, 'adws');
    this.pythonCmd = this._detectPythonCommand();
  }

  /**
   * Detect available Python command (uv > python3 > python)
   */
  _detectPythonCommand() {
    // Prefer uv for ADW scripts (they use uv shebang)
    return 'uv';
  }

  /**
   * Execute ADW Python script
   * @param {string} scriptName - Name of the script (e.g., 'adw_prompt.py')
   * @param {Array} args - Arguments to pass to the script
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result
   */
  async execute(scriptName, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.adwsDir, scriptName);

      // Check if script exists
      if (!fs.existsSync(scriptPath)) {
        return reject(new Error('Script not found: ' + scriptPath));
      }

      // Build command arguments
      const cmdArgs = ['run', scriptPath, ...args];

      // Spawn process
      const proc = spawn(this.pythonCmd, cmdArgs, {
        cwd: options.cwd || this.projectRoot,
        env: { ...process.env, ...options.env },
        stdio: options.silent ? 'pipe' : 'inherit',
      });

      let stdout = '';
      let stderr = '';

      if (options.silent) {
        proc.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
          stderr += data.toString();
        });
      }

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            exitCode: code,
            stdout: stdout,
            stderr: stderr,
          });
        } else {
          reject({
            success: false,
            exitCode: code,
            stdout: stdout,
            stderr: stderr,
            error: 'Process exited with code ' + code,
          });
        }
      });

      proc.on('error', (err) => {
        reject({
          success: false,
          error: err.message,
          details: err,
        });
      });
    });
  }

  /**
   * Execute adw_prompt.py
   */
  async runPrompt(prompt, options = {}) {
    const args = [prompt];

    if (options.model) {
      args.push('--model', options.model);
    }

    if (options.workingDir) {
      args.push('--working-dir', options.workingDir);
    }

    if (options.agentName) {
      args.push('--agent-name', options.agentName);
    }

    if (options.noRetry) {
      args.push('--no-retry');
    }

    return this.execute('adw_prompt.py', args, options);
  }

  /**
   * Execute adw_slash_command.py
   */
  async runSlashCommand(command, commandArgs = [], options = {}) {
    const args = [command, ...commandArgs];

    if (options.model) {
      args.push('--model', options.model);
    }

    if (options.workingDir) {
      args.push('--working-dir', options.workingDir);
    }

    if (options.agentName) {
      args.push('--agent-name', options.agentName);
    }

    return this.execute('adw_slash_command.py', args, options);
  }

  /**
   * Execute adw_chore_implement.py
   */
  async runChoreImplement(task, options = {}) {
    const args = [task];

    if (options.model) {
      args.push('--model', options.model);
    }

    if (options.workingDir) {
      args.push('--working-dir', options.workingDir);
    }

    return this.execute('adw_chore_implement.py', args, options);
  }

  /**
   * Check if Python/uv is available
   */
  async checkAvailability() {
    try {
      const result = await new Promise((resolve, reject) => {
        const proc = spawn('uv', ['--version'], { stdio: 'pipe' });
        let output = '';

        proc.stdout.on('data', (data) => {
          output += data.toString();
        });

        proc.on('close', (code) => {
          if (code === 0) {
            resolve({ available: true, version: output.trim() });
          } else {
            reject({ available: false });
          }
        });

        proc.on('error', () => {
          reject({ available: false });
        });
      });

      return result;
    } catch (err) {
      return { available: false, error: err };
    }
  }

  /**
   * Get latest ADW execution result
   */
  getLatestResult() {
    const agentsDir = path.join(this.projectRoot, 'agents');

    if (!fs.existsSync(agentsDir)) {
      return null;
    }

    // Get all ADW execution directories (sorted by modification time)
    const dirs = fs
      .readdirSync(agentsDir)
      .map((name) => ({
        name,
        path: path.join(agentsDir, name),
        mtime: fs.statSync(path.join(agentsDir, name)).mtime.getTime(),
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (dirs.length === 0) {
      return null;
    }

    // Get latest execution
    const latestDir = dirs[0];

    // Find summary file
    const summaryFiles = this._findFilesRecursive(
      latestDir.path,
      'custom_summary_output.json'
    );

    if (summaryFiles.length === 0) {
      return null;
    }

    // Read and return summary
    const summaryPath = summaryFiles[0];
    const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

    return {
      adwId: latestDir.name,
      summaryPath: summaryPath,
      ...summaryData,
    };
  }

  /**
   * Helper: Find files recursively
   */
  _findFilesRecursive(dir, filename) {
    const results = [];

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results.push(...this._findFilesRecursive(filePath, filename));
      } else if (file === filename) {
        results.push(filePath);
      }
    }

    return results;
  }
}

module.exports = { PythonAdapter };

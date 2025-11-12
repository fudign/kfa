const { execCommand } = require('./utils');
const path = require('path');
const fs = require('fs');

class DatabaseClient {
  constructor() {
    this.backendPath = path.join(process.cwd(), 'kfa-backend', 'kfa-api');
    this.artisan = path.join(this.backendPath, 'artisan');
  }

  async checkStatus() {
    const startTime = Date.now();
    try {
      const envPath = path.join(this.backendPath, '.env');
      if (!fs.existsSync(envPath)) {
        throw new Error('.env file not found in kfa-backend/kfa-api');
      }
      const envContent = fs.readFileSync(envPath, 'utf8');
      const dbHost = this._extractEnvVar(envContent, 'DB_HOST') || 'localhost';
      const dbName = this._extractEnvVar(envContent, 'DB_DATABASE') || 'unknown';
      const result = await execCommand('php artisan db:show', { cwd: this.backendPath });
      const latency = Date.now() - startTime;
      return {
        status: 'connected',
        host: dbHost,
        database: dbName,
        latency: latency,
        success: true
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message || 'Connection failed',
        success: false
      };
    }
  }

  async migrate(options = {}) {
    try {
      const cmd = options.fresh ? 'php artisan migrate:fresh' : 'php artisan migrate';
      const result = await execCommand(cmd, { cwd: this.backendPath });
      return {
        success: true,
        output: result.stdout,
        message: 'Migrations completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: error.stdout || '',
        stderr: error.stderr || ''
      };
    }
  }

  async seed(seeder = null) {
    try {
      const cmd = seeder ? `php artisan db:seed --class=${seeder}` : 'php artisan db:seed';
      const result = await execCommand(cmd, { cwd: this.backendPath });
      return {
        success: true,
        output: result.stdout,
        message: 'Database seeded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: error.stdout || '',
        stderr: error.stderr || ''
      };
    }
  }

  async backup() {
    try {
      const backupDir = path.join(process.cwd(), '.kfa', 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `db-backup-${timestamp}.sql`);
      const envPath = path.join(this.backendPath, '.env');
      const envContent = fs.readFileSync(envPath, 'utf8');
      const dbHost = this._extractEnvVar(envContent, 'DB_HOST') || 'localhost';
      const dbName = this._extractEnvVar(envContent, 'DB_DATABASE');
      const dbUser = this._extractEnvVar(envContent, 'DB_USERNAME');
      const dbPass = this._extractEnvVar(envContent, 'DB_PASSWORD');
      if (!dbName || !dbUser) {
        throw new Error('Database credentials not found in .env');
      }
      const cmd = `PGPASSWORD="${dbPass}" pg_dump -h ${dbHost} -U ${dbUser} -d ${dbName} > "${backupFile}"`;
      await execCommand(cmd);
      const stats = fs.statSync(backupFile);
      return {
        success: true,
        backupFile: backupFile,
        size: stats.size,
        message: 'Backup created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  _extractEnvVar(envContent, varName) {
    const regex = new RegExp(`^${varName}=(.*)$`, 'm');
    const match = envContent.match(regex);
    return match ? match[1].trim().replace(/^["']|["']$/g, '') : null;
  }
}

module.exports = { DatabaseClient };

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class Cache {
  constructor(namespace, options = {}) {
    this.namespace = namespace;
    this.ttl = options.ttl || 21600;
    this.cacheDir = path.join(process.cwd(), '.kfa', 'cache', namespace);
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  get(key) {
    const cacheFile = this._getCacheFile(key);
    if (!fs.existsSync(cacheFile)) {
      return null;
    }
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      if (Date.now() > data.expires) {
        fs.unlinkSync(cacheFile);
        return null;
      }
      return data.value;
    } catch (error) {
      try { fs.unlinkSync(cacheFile); } catch {}
      return null;
    }
  }

  set(key, value, customTtl = null) {
    const cacheFile = this._getCacheFile(key);
    const ttl = customTtl || this.ttl;
    const data = {
      value,
      expires: Date.now() + (ttl * 1000),
      timestamp: Date.now(),
      key,
      namespace: this.namespace
    };
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
    } catch (error) {
      if (process.env.DEBUG) {
        console.error('Cache write failed: ' + error.message);
      }
    }
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear(key = null) {
    if (key) {
      const cacheFile = this._getCacheFile(key);
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
      }
    } else {
      if (fs.existsSync(this.cacheDir)) {
        const files = fs.readdirSync(this.cacheDir);
        files.forEach(file => {
          try {
            fs.unlinkSync(path.join(this.cacheDir, file));
          } catch {}
        });
      }
    }
  }

  stats() {
    if (!fs.existsSync(this.cacheDir)) {
      return {
        namespace: this.namespace,
        totalEntries: 0,
        validEntries: 0,
        expiredEntries: 0,
        totalSize: 0,
        ttl: this.ttl
      };
    }
    const files = fs.readdirSync(this.cacheDir);
    let totalSize = 0;
    let validCount = 0;
    let expiredCount = 0;
    files.forEach(file => {
      const filepath = path.join(this.cacheDir, file);
      try {
        const stats = fs.statSync(filepath);
        totalSize += stats.size;
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        if (Date.now() > data.expires) {
          expiredCount++;
        } else {
          validCount++;
        }
      } catch {
        expiredCount++;
      }
    });
    return {
      namespace: this.namespace,
      totalEntries: files.length,
      validEntries: validCount,
      expiredEntries: expiredCount,
      totalSize: totalSize,
      ttl: this.ttl
    };
  }

  cleanExpired() {
    if (!fs.existsSync(this.cacheDir)) {
      return 0;
    }
    const files = fs.readdirSync(this.cacheDir);
    let removed = 0;
    files.forEach(file => {
      const filepath = path.join(this.cacheDir, file);
      try {
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        if (Date.now() > data.expires) {
          fs.unlinkSync(filepath);
          removed++;
        }
      } catch {
        try {
          fs.unlinkSync(filepath);
          removed++;
        } catch {}
      }
    });
    return removed;
  }

  _getCacheFile(key) {
    const hash = crypto.createHash('md5').update(key).digest('hex');
    return path.join(this.cacheDir, hash + '.json');
  }
}

module.exports = { Cache };

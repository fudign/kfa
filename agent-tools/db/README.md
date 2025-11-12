# Database Tools

Simple CLI tools for database operations. Each outputs JSON for easy piping.

## Tools

### migrate.js

Run Laravel migrations and output status.

```bash
node db/migrate.js [--fresh] [--seed]
```

Output: Migration status JSON

### backup.js

Backup database to file with timestamp.

```bash
node db/backup.js [--output=path]
```

Output: Backup file path + metadata JSON

### seed.js

Seed database with test data.

```bash
node db/seed.js [--class=SeederClass]
```

Output: Seeding results JSON

### status.js

Check database connection and table status.

```bash
node db/status.js
```

Output: Connection info + table list JSON

## Examples

```bash
# Fresh migration with seed
node db/migrate.js --fresh --seed > migration-result.json

# Backup before deploy
node db/backup.js --output=backups/pre-deploy.sql

# Check status and pipe to file
node db/status.js > db-status.json
```

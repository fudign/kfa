# How to Add a New Command to KFA CLI

Adding a new command takes **~5 minutes** using this template.

## Steps

### 1. Copy the Template

```bash
# From kfa-cli/ directory
cp templates/command.template.js commands/<category>/<command>.js
```

### 2. Edit the File

Replace placeholders:
- `[COMMAND NAME]` - Name of your command
- `[Brief description]` - Short description
- `[category]` - Command category (db, test, deploy, etc.)
- `[command]` - Command name

### 3. Implement Logic

Replace the `doSomething()` function with your actual logic:

```javascript
async function doSomething() {
  // Your implementation
  return { success: true, data: 'result' };
}
```

### 4. Test the Command

```bash
node bin/kfa.js <category> <command>
```

### 5. Update README (Optional)

Add your command to `README.md` under the appropriate section.

## Example: Adding `kfa cache warm`

### 1. Create File

```bash
cp templates/command.template.js commands/cache/warm.js
```

### 2. Edit Header

```javascript
/**
 * Warm cache with initial data
 *
 * Usage: kfa cache warm [--format json|text]
 */
```

### 3. Implement Logic

```javascript
async function execute(args) {
  const { flags } = parseArgs(args);
  const format = flags.format || 'text';

  const cache = new Cache('db', { ttl: 6 * 60 * 60 });

  // Warm cache with data
  const data = {
    'db-status': await checkDatabase(),
    'db-migrations': await checkMigrations(),
  };

  let warmed = 0;
  for (const [key, value] of Object.entries(data)) {
    if (cache.set(key, value)) {
      warmed++;
    }
  }

  if (format === 'json') {
    outputJSON({ warmed, total: Object.keys(data).length });
  } else {
    success(`Warmed ${warmed} cache entries`);
  }
}
```

### 4. Test

```bash
node bin/kfa.js cache warm
# ✅ Warmed 2 cache entries
```

Done! 🎉

## Command Structure

```javascript
commands/
└── <category>/
    └── <command>.js
        ├── execute(args)      // Main entry point
        ├── parseArgs()        // Parse arguments
        ├── Cache (optional)   // Use caching
        ├── Spinner (optional) // Show progress
        └── Output             // JSON or text
```

## Best Practices

1. **Always support both JSON and text output**
   ```javascript
   const format = flags.format || 'text';
   if (format === 'json') {
     outputJSON(data);
   } else {
     success('Done');
   }
   ```

2. **Use caching for repeated operations**
   ```javascript
   const cache = new Cache('category', { ttl: 6 * 60 * 60 });
   const cached = cache.get(key);
   if (cached) return cached;
   ```

3. **Show progress for long operations**
   ```javascript
   const spinner = new Spinner('Processing...');
   spinner.start();
   // ... do work ...
   spinner.succeed('Done');
   ```

4. **Handle errors gracefully**
   ```javascript
   try {
     await doWork();
   } catch (err) {
     error(err.message);
     process.exit(1);
   }
   ```

5. **Use parseArgs for argument parsing**
   ```javascript
   const { flags, positional } = parseArgs(args);
   const arg1 = positional[0];
   const option = flags.option;
   ```

## Common Utilities

Available from `lib/utils.js`:

- `success(msg)` - Green success message
- `error(msg)` - Red error message
- `warning(msg)` - Yellow warning message
- `info(msg)` - Cyan info message
- `outputJSON(data)` - Output JSON
- `Spinner(msg)` - Progress spinner
- `parseArgs(args)` - Parse CLI arguments
- `formatBytes(bytes)` - Format bytes to human-readable
- `formatDuration(ms)` - Format duration to human-readable
- `getProjectRoot()` - Get project root directory
- `fileExists(path)` - Check if file exists

## Testing

```bash
# Test your command
node bin/kfa.js <category> <command>

# Test with options
node bin/kfa.js <category> <command> --format json
node bin/kfa.js <category> <command> --no-cache

# Test error handling
node bin/kfa.js <category> <command> invalid-arg
```

## Time Breakdown

- Copy template: 10 seconds
- Edit placeholders: 1 minute
- Implement logic: 2-3 minutes
- Test: 1 minute

**Total: ~5 minutes** ✅

---

Questions? Check existing commands in `commands/` for examples.

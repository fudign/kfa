#!/usr/bin/env node
/**
 * [Tool Name]
 * [Brief description of what this tool does]
 *
 * Usage:
 *   node [category]/[tool-name].js [--option=value]
 *
 * Example:
 *   node [category]/[tool-name].js --input=test.txt
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// ============================================================================
// Configuration
// ============================================================================

// Parse command line arguments
const args = process.argv.slice(2);

// Define your arguments here
const exampleArg = args.find((a) => a.startsWith('--example='));
const exampleValue = exampleArg ? exampleArg.split('=')[1] : null;

// ============================================================================
// Validation
// ============================================================================

// Validate required arguments
if (!exampleValue) {
  console.error(
    JSON.stringify(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Missing required parameter: --example',
        usage: 'node [category]/[tool-name].js --example=value',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

// Validate argument values
if (exampleValue === 'invalid') {
  console.error(
    JSON.stringify(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Invalid value for --example parameter',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

// ============================================================================
// Main Logic
// ============================================================================

// Define paths (relative to project root)
const projectRoot = path.join(__dirname, '../..');
const targetPath = path.join(projectRoot, 'some/path');

// Your tool logic here
// Example: Execute a command
const command = `echo "Processing ${exampleValue}"`;

exec(command, (error, stdout, stderr) => {
  // Prepare result object
  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    input: exampleValue,
    output: stdout.trim(),
    error: error ? stderr || error.message : null,
  };

  // Add any additional data
  if (!error) {
    result.details = {
      // Add relevant details about what was done
      processed: true,
      // etc.
    };
  }

  // Output JSON result
  console.log(JSON.stringify(result, null, 2));

  // Exit with appropriate code
  process.exit(error ? 1 : 0);
});

// ============================================================================
// Helper Functions (if needed)
// ============================================================================

/**
 * Example helper function
 * @param {string} value - Input value
 * @returns {string} Processed value
 */
function processValue(value) {
  return value.trim().toLowerCase();
}

/**
 * Read environment variable from .env file
 * @param {string} filePath - Path to .env file
 * @param {string} key - Environment variable key
 * @returns {string} Environment variable value
 */
function getEnvVar(filePath, key) {
  if (!fs.existsSync(filePath)) {
    return '';
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

// ============================================================================
// Design Principles
// ============================================================================

/**
 * When creating a tool, follow these principles:
 *
 * 1. Keep it simple - Under 100 lines of code
 * 2. Single responsibility - One clear purpose
 * 3. JSON output - Always output structured JSON
 * 4. Error handling - Catch and report all errors
 * 5. Exit codes - 0 for success, 1 for failure
 * 6. Validation - Check all inputs
 * 7. Documentation - Clear comments and usage
 * 8. No dependencies - Only Node.js built-ins
 * 9. Composability - Output to stdout for piping
 * 10. Consistency - Follow existing patterns
 */

// ============================================================================
// Output Format
// ============================================================================

/**
 * Always output JSON with this structure:
 * {
 *   success: boolean,
 *   timestamp: ISO string,
 *   [data fields],
 *   error: string | null
 * }
 *
 * This allows:
 * - Easy parsing with jq
 * - Consistent error handling
 * - Chainable operations
 * - Clear success/failure status
 */

// ============================================================================
// Testing
// ============================================================================

/**
 * Test your tool:
 *
 * 1. Valid input:
 *    node [category]/[tool-name].js --example=valid
 *
 * 2. Invalid input:
 *    node [category]/[tool-name].js --example=invalid
 *
 * 3. Missing input:
 *    node [category]/[tool-name].js
 *
 * 4. Pipe to file:
 *    node [category]/[tool-name].js --example=test > result.json
 *
 * 5. Chain commands:
 *    node tool1.js > r1.json && node tool2.js > r2.json
 */

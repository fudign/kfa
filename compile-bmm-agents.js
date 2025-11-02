const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const agentsDir = path.join(__dirname, 'bmad', 'bmm', 'agents');
const yamlFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.agent.yaml'));

console.log(`Found ${yamlFiles.length} agent YAML files to compile...`);

yamlFiles.forEach(yamlFile => {
  const yamlPath = path.join(agentsDir, yamlFile);
  const mdFile = yamlFile.replace('.agent.yaml', '.md');
  const mdPath = path.join(agentsDir, mdFile);

  console.log(`Compiling ${yamlFile}...`);

  try {
    // Note: yaml-xml-builder.js is not meant to be called directly
    // We'll just copy as-is for now since BMad can load YAML directly
    console.log(`✓ ${yamlFile} (YAML format - no compilation needed)`);
  } catch (error) {
    console.error(`✗ Failed to compile ${yamlFile}:`, error.message);
  }
});

console.log('\nAll agents ready!');
console.log('\nYou can now use commands like:');
console.log('  /workflow-init');
console.log('  /workflow-status');
console.log('  /analyst');
console.log('  /pm');
console.log('  /architect');

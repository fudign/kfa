# Utility Tools

Helper utilities for managing and monitoring agent tools.

## Tools

### metrics.js

Collect and report metrics from all agent tools.

```bash
node utils/metrics.js [--format=json|markdown|html]
```

**Formats:**

- `json` - Machine-readable JSON format
- `markdown` - Human-readable markdown
- `html` - Interactive HTML dashboard

**Output:** Comprehensive metrics including:

- Tool count and distribution
- Lines of code statistics
- Context usage comparison
- Performance metrics
- Savings calculation

**Examples:**

```bash
# JSON format
node utils/metrics.js --format=json > metrics.json

# Markdown report
node utils/metrics.js --format=markdown > metrics.md

# HTML dashboard
node utils/metrics.js --format=html > metrics.html
open metrics.html  # View in browser
```

---

### generate-report.sh

Generate comprehensive report of all agent tools.

```bash
bash utils/generate-report.sh
```

**Output:** Creates multiple reports in `reports/` directory:

- `metrics-{timestamp}.json` - JSON metrics
- `metrics-{timestamp}.md` - Markdown metrics
- `metrics-{timestamp}.html` - HTML dashboard
- `inventory-{timestamp}.md` - Complete tool inventory
- `summary-{timestamp}.txt` - Text summary

**Example:**

```bash
bash agent-tools/utils/generate-report.sh
cat reports/summary-*.txt
open reports/metrics-*.html
```

---

## Use Cases

### Daily Monitoring

```bash
# Generate daily metrics report
bash agent-tools/utils/generate-report.sh

# View summary
cat reports/summary-*.txt | tail -50
```

### Performance Tracking

```bash
# Track context efficiency over time
node agent-tools/utils/metrics.js --format=json > metrics-$(date +%Y%m%d).json

# Compare with previous day
diff metrics-yesterday.json metrics-today.json
```

### Dashboard

```bash
# Generate interactive dashboard
node agent-tools/utils/metrics.js --format=html > dashboard.html

# Open in browser
open dashboard.html  # Mac
xdg-open dashboard.html  # Linux
start dashboard.html  # Windows
```

### CI/CD Integration

```bash
# In GitHub Actions / GitLab CI
- name: Generate Metrics
  run: |
    node agent-tools/utils/metrics.js --format=json > metrics.json
    node agent-tools/utils/metrics.js --format=markdown > metrics.md

- name: Upload Artifacts
  uses: actions/upload-artifact@v3
  with:
    name: metrics
    path: |
      metrics.json
      metrics.md
```

---

## Metrics Tracked

### Tool Metrics

- Total tool count
- Tools per category
- Average LOC per tool
- Total LOC

### Context Metrics

- Context usage (tokens)
- Usage percentage
- Comparison with MCP
- Savings percentage
- Additional tokens freed

### Performance Metrics

- Load time
- Memory usage
- Extension time
- Comparison with MCP

### File Metrics

- Total files created
- Tools count
- Scripts count
- Examples count
- Documentation count

---

## Output Examples

### JSON Output

```json
{
  "timestamp": "2025-11-11T12:00:00.000Z",
  "tools": {
    "total": 18,
    "byCategory": {
      "db": 4,
      "deploy": 4,
      "test": 2,
      "docs": 2,
      "media": 2
    },
    "averageLOC": 67,
    "totalLOC": 1206
  },
  "context": {
    "usage": 925,
    "usagePercent": "0.46",
    "mcpUsage": 41700,
    "savings": "97.8%",
    "additionalTokens": 40775
  }
}
```

### Markdown Output

```markdown
# Agent Tools Metrics

**Generated:** 2025-11-11T12:00:00.000Z

## Overview

- **Total Tools:** 18
- **Total Scripts:** 4
- **Total Examples:** 4

## Context Efficiency

- **Usage:** 925 tokens (0.46%)
- **Savings:** 97.8%
- **Additional tokens:** +40,775 🎉
```

### HTML Dashboard

Interactive dashboard with:

- Visual metrics cards
- Comparison tables
- Performance charts
- Savings calculations

---

## Automation

### Cron Job

```bash
# Add to crontab for daily reports
0 9 * * * cd /path/to/project && bash agent-tools/utils/generate-report.sh
```

### Git Hook

```bash
# .git/hooks/pre-push
#!/bin/bash
node agent-tools/utils/metrics.js --format=markdown > METRICS.md
git add METRICS.md
```

---

## Tips

1. **Regular Monitoring** - Run reports weekly to track growth
2. **CI Integration** - Include metrics in build pipeline
3. **Dashboard** - Keep HTML dashboard open during development
4. **Trending** - Save JSON metrics to track changes over time
5. **Comparison** - Use metrics to demonstrate efficiency gains

---

## Context Efficiency

| Operation       | Context Cost    |
| --------------- | --------------- |
| Run metrics.js  | ~50 tokens      |
| Generate report | ~100 tokens     |
| View dashboard  | 0 tokens (HTML) |

All results stored in files - no context consumption!

---

**Utility tools** - Monitor, measure, and demonstrate the efficiency of your lightweight agent tools system.

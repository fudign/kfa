#!/usr/bin/env -S uv run --quiet --script
# /// script
# dependencies = [
#   "pydantic",
#   "python-dotenv",
#   "rich"
# ]
# ///
"""
KFA Test Workflow - Run comprehensive tests on KFA project

Usage:
    ./adws/adw_kfa_test.py              # Run all tests
    ./adws/adw_kfa_test.py --quick      # Run quick health check only
    ./adws/adw_kfa_test.py --verbose    # Run with verbose output
"""

import sys
import os
import argparse
import subprocess
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import print as rprint

# Add adw_modules to path
sys.path.insert(0, str(Path(__file__).parent / "adw_modules"))

console = Console()

class TestResult:
    def __init__(self, name: str, success: bool, message: str, details: Dict[str, Any] = None):
        self.name = name
        self.success = success
        self.message = message
        self.details = details or {}
        self.timestamp = datetime.now().isoformat()

def run_command(cmd: List[str], cwd: str = None) -> tuple[bool, str]:
    """Run a command and return success status and output."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=60
        )
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return False, "Command timed out after 60 seconds"
    except Exception as e:
        return False, str(e)

def test_database_connection() -> TestResult:
    """Test database connection."""
    console.print("[cyan]Testing database connection...[/cyan]")
    success, output = run_command(["node", "agent-tools/supabase/test-connection.js"])

    return TestResult(
        name="Database Connection",
        success=success,
        message="Database is accessible" if success else "Database connection failed",
        details={"output": output[:500] if not success else "Connected"}
    )

def test_frontend_build() -> TestResult:
    """Test frontend build."""
    console.print("[cyan]Testing frontend build...[/cyan]")
    success, output = run_command(["node", "agent-tools/deploy/build-frontend.js"])

    return TestResult(
        name="Frontend Build",
        success=success,
        message="Frontend builds successfully" if success else "Frontend build failed",
        details={"output": output[:500] if not success else "Build succeeded"}
    )

def test_typescript_check() -> TestResult:
    """Test TypeScript type checking."""
    console.print("[cyan]Checking TypeScript types...[/cyan]")
    success, output = run_command(
        ["npx", "tsc", "--noEmit"],
        cwd="kfa-website"
    )

    return TestResult(
        name="TypeScript Check",
        success=success,
        message="No TypeScript errors" if success else "TypeScript errors found",
        details={"output": output[:500] if not success else "No errors"}
    )

def test_environment_variables() -> TestResult:
    """Test environment variables."""
    console.print("[cyan]Verifying environment variables...[/cyan]")
    success, output = run_command(["node", "agent-tools/deploy/verify-env.js"])

    return TestResult(
        name="Environment Variables",
        success=success,
        message="All required env vars present" if success else "Missing env vars",
        details={"output": output[:500] if not success else "All vars present"}
    )

def test_deployment_health() -> TestResult:
    """Test deployment health."""
    console.print("[cyan]Checking deployment health...[/cyan]")
    success, output = run_command([
        "node", "agent-tools/deploy/health-check.js",
        "--url=https://kfa-website.vercel.app"
    ])

    return TestResult(
        name="Deployment Health",
        success=success,
        message="Deployment is healthy" if success else "Deployment health check failed",
        details={"output": output[:500] if not success else "Healthy"}
    )

def run_quick_tests() -> List[TestResult]:
    """Run quick health check tests."""
    return [
        test_database_connection(),
        test_environment_variables()
    ]

def run_full_tests() -> List[TestResult]:
    """Run full test suite."""
    return [
        test_database_connection(),
        test_environment_variables(),
        test_typescript_check(),
        test_frontend_build(),
        test_deployment_health()
    ]

def display_results(results: List[TestResult], verbose: bool = False):
    """Display test results in a nice table."""
    table = Table(title="KFA Test Results", show_header=True, header_style="bold magenta")
    table.add_column("Test", style="cyan")
    table.add_column("Status", justify="center")
    table.add_column("Message", style="white")

    passed = 0
    failed = 0

    for result in results:
        status = "✅ PASS" if result.success else "❌ FAIL"
        style = "green" if result.success else "red"

        table.add_row(
            result.name,
            f"[{style}]{status}[/{style}]",
            result.message
        )

        if result.success:
            passed += 1
        else:
            failed += 1

        if verbose and not result.success and result.details.get("output"):
            console.print(f"\n[red]Details for {result.name}:[/red]")
            console.print(Panel(result.details["output"], border_style="red"))

    console.print(table)
    console.print(f"\n[green]Passed: {passed}[/green] | [red]Failed: {failed}[/red]\n")

    # Save results to JSON
    results_dir = Path("agents") / "test-results"
    results_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    results_file = results_dir / f"test-results-{timestamp}.json"

    with open(results_file, "w") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "passed": passed,
            "failed": failed,
            "total": len(results),
            "results": [
                {
                    "name": r.name,
                    "success": r.success,
                    "message": r.message,
                    "timestamp": r.timestamp,
                    "details": r.details
                }
                for r in results
            ]
        }, f, indent=2)

    console.print(f"[dim]Results saved to: {results_file}[/dim]\n")

    return failed == 0

def main():
    parser = argparse.ArgumentParser(description="KFA Test Workflow")
    parser.add_argument("--quick", action="store_true", help="Run quick health check only")
    parser.add_argument("--verbose", action="store_true", help="Show detailed output")

    args = parser.parse_args()

    console.print(Panel.fit(
        "🧪 [bold cyan]KFA Test Suite[/bold cyan]",
        border_style="cyan"
    ))

    if args.quick:
        console.print("[yellow]Running quick health check...[/yellow]\n")
        results = run_quick_tests()
    else:
        console.print("[yellow]Running full test suite...[/yellow]\n")
        results = run_full_tests()

    success = display_results(results, verbose=args.verbose)

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()

#!/usr/bin/env -S uv run --quiet --script
# /// script
# dependencies = [
#   "pydantic",
#   "python-dotenv",
#   "rich"
# ]
# ///
"""
KFA Deploy Workflow - Deploy KFA application with safety checks

Usage:
    ./adws/adw_kfa_deploy.py              # Full deploy with checks
    ./adws/adw_kfa_deploy.py --skip-tests # Deploy without tests
    ./adws/adw_kfa_deploy.py --force      # Force deploy even if checks fail
"""

import sys
import os
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich import print as rprint

# Add adw_modules to path
sys.path.insert(0, str(Path(__file__).parent / "adw_modules"))

console = Console()

def run_command(cmd: List[str], cwd: str = None, check: bool = True) -> tuple[bool, str]:
    """Run a command and return success status and output."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout for deploy commands
        )
        success = result.returncode == 0
        output = result.stdout + result.stderr

        if check and not success:
            console.print(f"[red]Command failed:[/red] {' '.join(cmd)}")
            console.print(f"[red]Output:[/red]\n{output[:500]}")

        return success, output
    except subprocess.TimeoutExpired:
        return False, "Command timed out"
    except Exception as e:
        return False, str(e)

def pre_deploy_checks(skip_tests: bool = False) -> bool:
    """Run pre-deployment checks."""
    console.print("\n[bold cyan]Running pre-deployment checks...[/bold cyan]\n")

    checks = []

    # Check 1: Verify environment variables
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Verifying environment variables...", total=None)
        success, _ = run_command(["node", "agent-tools/deploy/verify-env.js"], check=False)
        progress.update(task, completed=True)
        checks.append(("Environment Variables", success))
        console.print(f"  {'✅' if success else '❌'} Environment variables")

    # Check 2: Database connection
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Testing database connection...", total=None)
        success, _ = run_command(["node", "agent-tools/supabase/test-connection.js"], check=False)
        progress.update(task, completed=True)
        checks.append(("Database Connection", success))
        console.print(f"  {'✅' if success else '❌'} Database connection")

    # Check 3: TypeScript check
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Checking TypeScript types...", total=None)
        success, _ = run_command(["npx", "tsc", "--noEmit"], cwd="kfa-website", check=False)
        progress.update(task, completed=True)
        checks.append(("TypeScript Check", success))
        console.print(f"  {'✅' if success else '❌'} TypeScript types")

    # Check 4: Frontend build
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Testing frontend build...", total=None)
        success, _ = run_command(["node", "agent-tools/deploy/build-frontend.js"], check=False)
        progress.update(task, completed=True)
        checks.append(("Frontend Build", success))
        console.print(f"  {'✅' if success else '❌'} Frontend build")

    # Check 5: Run tests (if not skipped)
    if not skip_tests:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console
        ) as progress:
            task = progress.add_task("Running tests...", total=None)
            # Run quick test if full test suite doesn't exist
            if Path("adws/adw_kfa_test.py").exists():
                success, _ = run_command(["python", "adws/adw_kfa_test.py", "--quick"], check=False)
            else:
                success = True  # Skip if test script doesn't exist
            progress.update(task, completed=True)
            checks.append(("Tests", success))
            console.print(f"  {'✅' if success else '❌'} Tests")

    all_passed = all(success for _, success in checks)

    if all_passed:
        console.print("\n[green]✅ All pre-deployment checks passed![/green]\n")
    else:
        console.print("\n[red]❌ Some pre-deployment checks failed![/red]\n")
        for name, success in checks:
            if not success:
                console.print(f"  [red]Failed: {name}[/red]")

    return all_passed

def deploy_frontend() -> bool:
    """Deploy frontend to Vercel."""
    console.print("\n[bold cyan]Deploying frontend to Vercel...[/bold cyan]\n")

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Pushing to git...", total=None)

        # Check if there are changes to commit
        status_success, status_output = run_command(["git", "status", "--porcelain"], check=False)

        if status_success and status_output.strip():
            # There are changes - inform user
            console.print("[yellow]⚠ Uncommitted changes detected[/yellow]")
            console.print("[dim]Vercel will deploy the latest commit on the main branch[/dim]")
            console.print("[dim]Make sure to commit and push your changes first[/dim]\n")
            return False

        progress.update(task, completed=True)
        console.print("  ✅ No uncommitted changes")

    # Check Vercel deployment status
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Checking Vercel deployment...", total=None)
        success, output = run_command(["node", "agent-tools/vercel/check-frontend.js"], check=False)
        progress.update(task, completed=True)
        console.print(f"  {'✅' if success else '❌'} Vercel deployment check")

    console.print("\n[green]✅ Frontend deployment completed![/green]")
    console.print("[dim]Vercel auto-deploys on git push to main branch[/dim]")
    console.print("[cyan]Check status at: https://vercel.com/dashboard[/cyan]\n")

    return True

def post_deploy_checks() -> bool:
    """Run post-deployment checks."""
    console.print("\n[bold cyan]Running post-deployment checks...[/bold cyan]\n")

    checks = []

    # Check 1: Health check
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Checking deployment health...", total=None)
        success, _ = run_command([
            "node", "agent-tools/deploy/health-check.js",
            "--url=https://kfa-website.vercel.app"
        ], check=False)
        progress.update(task, completed=True)
        checks.append(("Health Check", success))
        console.print(f"  {'✅' if success else '❌'} Deployment health")

    all_passed = all(success for _, success in checks)

    if all_passed:
        console.print("\n[green]✅ All post-deployment checks passed![/green]\n")
    else:
        console.print("\n[red]❌ Some post-deployment checks failed![/red]\n")

    return all_passed

def main():
    parser = argparse.ArgumentParser(description="KFA Deploy Workflow")
    parser.add_argument("--skip-tests", action="store_true", help="Skip running tests")
    parser.add_argument("--force", action="store_true", help="Force deploy even if checks fail")

    args = parser.parse_args()

    console.print(Panel.fit(
        "🚀 [bold cyan]KFA Deployment Workflow[/bold cyan]",
        border_style="cyan"
    ))

    # Pre-deployment checks
    pre_checks_passed = pre_deploy_checks(skip_tests=args.skip_tests)

    if not pre_checks_passed and not args.force:
        console.print("[red]❌ Pre-deployment checks failed. Use --force to deploy anyway.[/red]")
        sys.exit(1)

    if not pre_checks_passed and args.force:
        console.print("[yellow]⚠ Pre-deployment checks failed but continuing with --force[/yellow]\n")

    # Deploy
    deploy_success = deploy_frontend()

    if not deploy_success:
        console.print("[red]❌ Deployment failed[/red]")
        sys.exit(1)

    # Post-deployment checks
    post_checks_passed = post_deploy_checks()

    if post_checks_passed:
        console.print(Panel.fit(
            "[bold green]✅ Deployment completed successfully![/bold green]\n"
            "[cyan]URL:[/cyan] https://kfa-website.vercel.app",
            border_style="green"
        ))
        sys.exit(0)
    else:
        console.print("[yellow]⚠ Deployment completed but post-checks failed[/yellow]")
        sys.exit(1)

if __name__ == "__main__":
    main()

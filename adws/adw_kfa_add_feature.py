#!/usr/bin/env -S uv run --quiet --script
# /// script
# dependencies = [
#   "pydantic",
#   "python-dotenv",
#   "rich"
# ]
# ///
"""
KFA Add Feature Workflow - Guide adding a new feature to KFA

This workflow uses Claude Code to help you add a new feature to KFA
by following best practices and using the /kfa-add-feature slash command.

Usage:
    ./adws/adw_kfa_add_feature.py "Add member registration form"
    ./adws/adw_kfa_add_feature.py "Add event calendar view" --model opus
"""

import sys
import os
import argparse
from pathlib import Path
from datetime import datetime

# Add adw_modules to path
sys.path.insert(0, str(Path(__file__).parent / "adw_modules"))

from agent import (
    AgentTemplateRequest,
    execute_template,
    generate_short_id,
)
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()

def main():
    parser = argparse.ArgumentParser(
        description="KFA Add Feature Workflow - Use Claude Code to add a new feature"
    )
    parser.add_argument(
        "feature_description",
        help="Description of the feature to add (e.g., 'Add member registration form')"
    )
    parser.add_argument(
        "--model",
        choices=["sonnet", "opus"],
        default="sonnet",
        help="Claude model to use (default: sonnet)"
    )

    args = parser.parse_args()

    # Generate unique workflow ID
    adw_id = generate_short_id()

    console.print(Panel.fit(
        f"🎨 [bold cyan]KFA Add Feature Workflow[/bold cyan]\n"
        f"[dim]ADW ID: {adw_id}[/dim]",
        border_style="cyan"
    ))

    # Display feature info
    info_table = Table(show_header=False, box=None)
    info_table.add_column("Key", style="cyan")
    info_table.add_column("Value", style="white")
    info_table.add_row("Feature", args.feature_description)
    info_table.add_row("Model", args.model)
    info_table.add_row("Workflow ID", adw_id)

    console.print(info_table)
    console.print()

    # Create agent request
    request = AgentTemplateRequest(
        agent_name="feature_builder",
        slash_command="/kfa-add-feature",
        args=[args.feature_description],
        adw_id=adw_id,
        model=args.model,
        working_dir=None  # Use current directory
    )

    # Execute
    console.print("[yellow]Executing /kfa-add-feature command...[/yellow]\n")

    response = execute_template(request)

    # Display results
    if response.success:
        console.print(Panel.fit(
            "[bold green]✅ Feature implementation completed![/bold green]\n"
            f"[dim]Session ID: {response.session_id}[/dim]",
            border_style="green"
        ))

        # Show output location
        output_dir = Path("agents") / adw_id / "feature_builder"
        console.print(f"\n[cyan]Output saved to:[/cyan]")
        console.print(f"  📁 {output_dir}/")
        console.print(f"  📄 {output_dir}/cc_final_object.json")
        console.print(f"  📄 {output_dir}/cc_raw_output.jsonl")

        # Show next steps
        console.print("\n[bold cyan]Next Steps:[/bold cyan]")
        console.print("  1. Review the generated files")
        console.print("  2. Test the new feature locally")
        console.print("  3. Run tests: [cyan]./adws/adw_kfa_test.py[/cyan]")
        console.print("  4. Deploy: [cyan]./adws/adw_kfa_deploy.py[/cyan]")

        sys.exit(0)
    else:
        console.print(Panel.fit(
            f"[bold red]❌ Feature implementation failed[/bold red]\n"
            f"[dim]Error: {response.output[:200]}[/dim]",
            border_style="red"
        ))

        # Show output location for debugging
        output_dir = Path("agents") / adw_id / "feature_builder"
        console.print(f"\n[cyan]Debug output:[/cyan]")
        console.print(f"  📁 {output_dir}/")

        sys.exit(1)

if __name__ == "__main__":
    main()

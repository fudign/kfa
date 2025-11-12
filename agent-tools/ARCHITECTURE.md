# Agent Tools Architecture

Visual architecture and design patterns for lightweight CLI tools.

## System Architecture

```mermaid
graph TB
    subgraph "AI Agent Context (200k tokens)"
        Agent[AI Agent]
        Docs[Tool Docs<br/>925 tokens<br/>0.46%]
    end

    subgraph "Agent Tools"
        DB[Database Tools<br/>4 tools]
        Deploy[Deploy Tools<br/>4 tools]
        Test[Test Tools<br/>2 tools]
        Docs2[Docs Tools<br/>2 tools]
        Media[Media Tools<br/>2 tools]
    end

    subgraph "Scripts & Workflows"
        Scripts[Composable Scripts<br/>4 scripts]
        Examples[Usage Examples<br/>4 examples]
    end

    subgraph "Output (0 context)"
        Files[JSON Files<br/>results/]
        Logs[Log Files<br/>logs/]
    end

    subgraph "Target Systems"
        DBSystem[(PostgreSQL<br/>Database)]
        Frontend[React<br/>Frontend]
        Backend[Laravel<br/>Backend]
        Storage[Supabase<br/>Storage]
    end

    Agent -->|Loads 925 tokens| Docs
    Agent -->|Executes| DB
    Agent -->|Executes| Deploy
    Agent -->|Executes| Test
    Agent -->|Executes| Docs2
    Agent -->|Executes| Media

    DB -->|Write results| Files
    Deploy -->|Write results| Files
    Test -->|Write results| Files
    Docs2 -->|Write results| Files
    Media -->|Write results| Files

    Scripts -->|Orchestrate| DB
    Scripts -->|Orchestrate| Deploy
    Scripts -->|Orchestrate| Test

    DB -->|Connect| DBSystem
    Deploy -->|Build| Frontend
    Deploy -->|Build| Backend
    Test -->|Test| Frontend
    Test -->|Test| Backend
    Media -->|Upload| Storage
```

## Context Consumption Flow

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant Docs as Tool Docs
    participant Tool as CLI Tool
    participant File as JSON File
    participant System as Target System

    Note over Agent: Available: 200k tokens

    Agent->>Docs: Load documentation
    Note over Agent,Docs: -925 tokens<br/>(0.46%)
    Note over Agent: Remaining: 199,075 tokens

    Agent->>Tool: Execute command
    Note over Agent,Tool: 0 tokens consumed

    Tool->>System: Perform operation
    System-->>Tool: Result

    Tool->>File: Write JSON output
    Note over File: Result stored<br/>outside context

    Note over Agent: Context still at<br/>199,075 tokens!

    Agent->>File: Read if needed
    Note over Agent,File: Only when required
```

## Tool Design Pattern

```mermaid
flowchart LR
    subgraph "Tool Structure (<100 LOC)"
        Input[Parse Arguments]
        Validate[Validate Input]
        Execute[Execute Operation]
        Output[Format JSON]
        Exit[Exit with Code]
    end

    CLI[Command Line] --> Input
    Input --> Validate
    Validate -->|Valid| Execute
    Validate -->|Invalid| Error[Error JSON]
    Execute -->|Success| Output
    Execute -->|Failure| Error
    Output --> Exit
    Error --> Exit
    Exit -->|0 success| Stdout[stdout]
    Exit -->|1 error| Stderr[stderr]
```

## Composability Pattern

```mermaid
graph LR
    subgraph "Sequential Execution"
        T1[Tool 1] -->|result.json| T2[Tool 2]
        T2 -->|result2.json| T3[Tool 3]
        T3 -->|result3.json| Done[Complete]
    end

    subgraph "Parallel Execution"
        Start[Start] --> P1[Tool A]
        Start --> P2[Tool B]
        Start --> P3[Tool C]
        P1 --> Merge[Collect Results]
        P2 --> Merge
        P3 --> Merge
    end

    subgraph "Conditional Execution"
        Check[Tool Check] -->|Success| Action1[Tool Deploy]
        Check -->|Failure| Action2[Tool Rollback]
    end
```

## Deployment Workflow

```mermaid
stateDiagram-v2
    [*] --> PreCheck: Start Deployment

    PreCheck --> EnvVerify: Verify Environment
    EnvVerify --> DBStatus: Check Database
    DBStatus --> UnitTests: Run Unit Tests

    UnitTests --> Backup: Tests Pass
    UnitTests --> [*]: Tests Fail ❌

    Backup --> BuildFrontend: Backup Created
    BuildFrontend --> BuildBackend: Build Success
    BuildBackend --> Migrate: Build Success

    BuildFrontend --> [*]: Build Fail ❌
    BuildBackend --> [*]: Build Fail ❌

    Migrate --> E2ETests: Migrate Success
    Migrate --> Rollback: Migrate Fail ❌

    E2ETests --> HealthCheck: Tests Pass
    E2ETests --> Warning: Tests Fail ⚠️

    HealthCheck --> [*]: Success ✅
    Warning --> [*]: Deployed with warnings ⚠️
    Rollback --> [*]: Rolled back ❌
```

## Data Flow Architecture

```mermaid
flowchart TB
    subgraph "Context Boundary (Minimal)"
        Agent[AI Agent<br/>199k tokens available]
        ToolDocs[Tool Documentation<br/>925 tokens loaded]
    end

    subgraph "Execution Layer (0 Context)"
        DB[db/migrate.js]
        Deploy[deploy/build-frontend.js]
        Test[test/run-e2e.js]
        Health[deploy/health-check.js]
    end

    subgraph "Storage Layer (0 Context)"
        F1[results/migrate.json]
        F2[results/build.json]
        F3[results/tests.json]
        F4[results/health.json]
    end

    subgraph "Target Systems"
        PostgreSQL[(PostgreSQL)]
        React[React App]
        Laravel[Laravel API]
        Supabase[Supabase Storage]
    end

    Agent -->|Read once| ToolDocs
    Agent -->|Execute| DB
    Agent -->|Execute| Deploy
    Agent -->|Execute| Test
    Agent -->|Execute| Health

    DB --> F1
    Deploy --> F2
    Test --> F3
    Health --> F4

    DB --> PostgreSQL
    Deploy --> React
    Deploy --> Laravel
    Test --> React
    Health --> Laravel

    F1 -.->|Read if needed| Agent
    F2 -.->|Read if needed| Agent
    F3 -.->|Read if needed| Agent
    F4 -.->|Read if needed| Agent
```

## Comparison: MCP vs Lightweight CLI

```mermaid
graph TB
    subgraph "MCP Approach"
        M_Agent[Agent Context<br/>200k tokens]
        M_Load[Load MCP Servers<br/>-41,700 tokens]
        M_Remain[Available<br/>158,300 tokens<br/>79.2%]
        M_Results[Results in Context<br/>-1,500 tokens/op]
    end

    subgraph "Lightweight CLI Approach"
        L_Agent[Agent Context<br/>200k tokens]
        L_Load[Load Tool Docs<br/>-925 tokens]
        L_Remain[Available<br/>199,075 tokens<br/>99.5%]
        L_Results[Results in Files<br/>0 tokens/op]
    end

    M_Agent --> M_Load
    M_Load --> M_Remain
    M_Remain --> M_Results

    L_Agent --> L_Load
    L_Load --> L_Remain
    L_Remain --> L_Results

    style M_Remain fill:#ffcccc
    style L_Remain fill:#ccffcc
    style M_Results fill:#ffcccc
    style L_Results fill:#ccffcc
```

## Tool Categories & Dependencies

```mermaid
graph LR
    subgraph "Database Tools"
        DB_Status[status.js]
        DB_Backup[backup.js]
        DB_Migrate[migrate.js]
        DB_Seed[seed.js]
    end

    subgraph "Deploy Tools"
        Deploy_Env[verify-env.js]
        Deploy_Frontend[build-frontend.js]
        Deploy_Backend[build-backend.js]
        Deploy_Health[health-check.js]
    end

    subgraph "Test Tools"
        Test_Unit[run-unit.js]
        Test_E2E[run-e2e.js]
    end

    subgraph "Orchestration Scripts"
        Script_PreDeploy[pre-deploy-check.sh]
        Script_Deploy[full-deploy.sh]
        Script_Test[test-all.sh]
        Script_SafeMigrate[backup-and-migrate.sh]
    end

    Script_PreDeploy --> Deploy_Env
    Script_PreDeploy --> DB_Status
    Script_PreDeploy --> Test_Unit

    Script_Deploy --> Script_PreDeploy
    Script_Deploy --> DB_Backup
    Script_Deploy --> Deploy_Frontend
    Script_Deploy --> Deploy_Backend
    Script_Deploy --> DB_Migrate
    Script_Deploy --> Test_E2E
    Script_Deploy --> Deploy_Health

    Script_SafeMigrate --> DB_Backup
    Script_SafeMigrate --> DB_Migrate
    Script_SafeMigrate --> DB_Status

    Script_Test --> Test_Unit
    Script_Test --> Test_E2E
```

## Extension Pattern

```mermaid
flowchart TD
    Start[Need New Tool] --> Identify[Identify Category]

    Identify --> Template[Use Template]
    Template --> Implement[Implement Logic<br/><100 LOC]

    Implement --> JSON[Add JSON Output]
    JSON --> Error[Add Error Handling]
    Error --> Test[Test Locally]

    Test --> Doc[Update README]
    Doc --> Package[Add to package.json]

    Package --> Done[Tool Ready]
    Done --> Usage[10-15 minutes total!]

    style Start fill:#e1f5ff
    style Done fill:#ccffcc
    style Usage fill:#ccffcc
```

## Performance Comparison

```mermaid
graph LR
    subgraph "Metrics"
        M1[Context Usage]
        M2[Tool Count]
        M3[Load Time]
        M4[Memory]
        M5[Extension Time]
    end

    subgraph "MCP"
        MCP1[41,700 tokens]
        MCP2[62 tools]
        MCP3[~2 seconds]
        MCP4[~150MB]
        MCP5[2-4 hours]
    end

    subgraph "Lightweight CLI"
        CLI1[925 tokens]
        CLI2[18 tools]
        CLI3[Instant]
        CLI4[~5MB]
        CLI5[10-15 min]
    end

    subgraph "Improvement"
        I1[↓ 97.8%]
        I2[↓ 70.9%]
        I3[↑ 100%]
        I4[↓ 96.7%]
        I5[↓ 95%]
    end

    M1 --> MCP1
    M1 --> CLI1
    MCP1 -.-> I1
    CLI1 -.-> I1

    M2 --> MCP2
    M2 --> CLI2
    MCP2 -.-> I2
    CLI2 -.-> I2

    M3 --> MCP3
    M3 --> CLI3
    MCP3 -.-> I3
    CLI3 -.-> I3

    M4 --> MCP4
    M4 --> CLI4
    MCP4 -.-> I4
    CLI4 -.-> I4

    M5 --> MCP5
    M5 --> CLI5
    MCP5 -.-> I5
    CLI5 -.-> I5

    style I1 fill:#ccffcc
    style I2 fill:#ccffcc
    style I3 fill:#ccffcc
    style I4 fill:#ccffcc
    style I5 fill:#ccffcc
```

## Integration Points

```mermaid
graph TB
    subgraph "Development"
        Git[Git Hooks]
        Local[Local Scripts]
        IDE[IDE Integration]
    end

    subgraph "CI/CD"
        GH[GitHub Actions]
        GL[GitLab CI]
        Jenkins[Jenkins]
    end

    subgraph "Production"
        Cron[Cron Jobs]
        Monitor[Monitoring]
        Deploy[Deployment]
    end

    subgraph "Agent Tools"
        Tools[CLI Tools]
        Scripts[Orchestration]
        Examples[Templates]
    end

    Git --> Tools
    Local --> Scripts
    IDE --> Tools

    GH --> Scripts
    GL --> Scripts
    Jenkins --> Scripts

    Cron --> Tools
    Monitor --> Tools
    Deploy --> Scripts

    Tools --> Examples
    Scripts --> Examples
```

## Design Principles

```mermaid
mindmap
  root((Lightweight<br/>Agent Tools))
    Simple
      <100 LOC per tool
      Single responsibility
      Easy to understand
    Composable
      JSON output
      Bash pipes
      File-based results
    Efficient
      Minimal context
      Zero dependencies
      Fast execution
    Maintainable
      Clear documentation
      Consistent patterns
      Self-contained
    Extensible
      Template-based
      10-15 min to add
      No breaking changes
```

---

## Key Takeaways

1. **Context Efficiency**: Tools live outside agent context, results in files
2. **Composability**: JSON output enables bash pipe composition
3. **Simplicity**: Each tool <100 LOC, single purpose
4. **Zero Dependencies**: Only Node.js built-ins
5. **Fast Extension**: Template-based, 10-15 minutes
6. **Production Ready**: Battle-tested patterns, comprehensive docs

---

**Visual architecture demonstrates why lightweight CLI tools are superior to heavy MCP servers for AI agent operations.**

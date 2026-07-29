---
name: Multi-Tasking Orchestrator
description: Guidelines and protocols for breaking down complex requirements and executing multiple tasks concurrently using parallel tool calls.
---

# Multi-Tasking Orchestrator Skill

This skill provides a framework for accelerating development by working on multiple tasks at the same time. Since the system supports concurrent execution of tool calls, you must leverage this capability to handle large PRDs (like the 10 Core Modules) efficiently.

## Core Directives

### 1. Parallel Tool Execution
When faced with multiple independent tasks (e.g., viewing several files to gather context, generating multiple new UI components, or running independent commands), you MUST issue the tool calls concurrently in a single response.

**Example of Concurrent Execution:**
You can read the schema, view a component, and list a directory all at once by stacking the tool calls:
`call:view_file{...}`
`call:view_file{...}`
`call:list_dir{...}`

### 2. Dependency Management (`waitForPreviousTools`)
- **Parallel by Default:** All tool calls execute in parallel by default.
- **Sequential Execution:** If a tool call STRICTLY depends on the outcome of a previous tool call in the same turn (e.g., creating a file and then running a command on that specific file), you must set `waitForPreviousTools: true` on the dependent tool call.

### 3. Task Decomposition Strategy
When implementing a massive update (like the MITRA PRD):
1. **Analyze & Group:** Group tasks that don't depend on each other. For example, updating the Prisma Schema is independent of updating the CSS styles.
2. **Execute Concurrently:** Issue a parallel `replace_file_content` for the Prisma Schema and a `replace_file_content` for the CSS file in the same turn.
3. **Verify:** Use parallel `run_command` calls (like `npm run build` and `npx prisma generate`) to verify the changes, managing their `waitForPreviousTools` flags appropriately.

### 4. Browser Subagents
For tasks that require interacting with the browser (e.g., visual QA, testing the UI), use the `browser_subagent` tool. You can spin up a subagent to test the frontend while you continue coding the backend concurrently.

By strictly adhering to these guidelines, development speed will be drastically increased, acting as a "multi-agent" swarm working on the codebase simultaneously.

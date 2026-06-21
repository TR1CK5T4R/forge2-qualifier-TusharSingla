# Architecture

## Overview

This project uses a two-agent system to build a small Trello-style Kanban
app. One agent plans and remembers context ("the brain"), the other writes
and ships code ("the hands"). All coordination happens in Slack — no agent
works in DMs or off-channel.

## Agents

### Hermes — the brain

- **Role:** planning, decision-making, persistent memory, autonomous status
  updates.
- **Runs as:** Hermes Agent (Nous Research), CLI + Slack gateway, local
  terminal backend.
- **Responsibilities:**
  - Receives project goals and decisions from the human in `#sprint-main`.
  - Turns goals into a plan + task breakdown before any code is written.
  - Hands off approved tasks to OpenClaw by posting a task spec in
    `#agent-coder`.
  - Persists key facts (repo name, branch, conventions) across sessions
    using its built-in memory feature — no need to re-paste context.
  - Runs a recurring cron job that posts an unattended progress update to
    `#agent-log` every 10 minutes, proving autonomous operation.
  - Applies the `status-report` skill whenever asked for a status update.

### OpenClaw — the hands

- **Role:** code generation, execution, and version control.
- **Runs as:** OpenClaw coding agent, configured via `openclaw.json`.
- **Responsibilities:**
  - Receives task specs from Hermes in `#agent-coder` only.
  - Writes code, runs it locally to verify it works, and commits
    incrementally (not one giant commit at the end).
  - Pushes directly to the `forge2-qualifier-TusharSingla` repo, `main`
    branch.
  - Reports back in `#agent-coder` after each task using exactly three
    sections: **What I Did** / **What's Left** / **What Needs Your Call**.
  - Never commits real secrets — always uses `.env.example` placeholders
    when a new `.env` is needed.

## Slack channel scheme

| Channel         | Purpose                                                                 |
|------------------|--------------------------------------------------------------------------|
| `#sprint-main`   | Human ↔ Hermes. Goals, plans, decisions, and status updates land here. |
| `#agent-coder`   | Hermes assigns coding tasks; OpenClaw works and reports here.          |
| `#agent-log`     | Raw agent activity and autonomous-run output. The audit trail.        |

**The loop:**

```
Human posts goal in #sprint-main
        ↓
Hermes posts plan + task breakdown in #sprint-main
        ↓
Human approves / corrects
        ↓
Hermes hands task to OpenClaw in #agent-coder
        ↓
OpenClaw writes code, runs it, commits, pushes
        ↓
OpenClaw reports (What I Did / What's Left / What Needs Your Call) in #agent-coder
        ↓
Human approves or corrects → loop continues
```

No agent works in private DMs or off-channel. `#agent-log` is a one-way
audit trail — only Hermes's cron job posts there.

## Model routing

| Agent    | Model              | Provider          | Why                                                                 |
|----------|--------------------|--------------------|----------------------------------------------------------------------|
| Hermes   | `gemini-2.5-flash` | Google AI Studio  | Fast, cheap reasoning model; sufficient for planning/orchestration and well within free-tier rate limits for a short hackathon build. |
| OpenClaw | `gemini-2.5-flash` | Google AI Studio  | Same model family kept consistent across agents to simplify quota tracking; flash tier balances code-generation quality against free-tier token limits. |

Both agents share the same underlying model family deliberately — running
two different model providers would have made free-tier quota tracking
harder to reason about under hackathon time pressure.

## Repository

- **Repo:** `forge2-qualifier-TusharSingla`
- **Default branch:** `main`
- **Backend:** `/backend` — Laravel (PHP 8.2+), REST API, SQLite
- **Frontend:** `/frontend` — React (Vite)
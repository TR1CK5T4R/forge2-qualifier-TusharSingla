# Forge2 Kanban — Two-Agent Hackathon Build

A small Trello-style Kanban board, built end-to-end through a two-agent
Slack pipeline: a planning agent (Hermes) and a coding agent (OpenClaw)
that write, run, and ship the code through a Slack-based loop, with a
human reviewing and approving each step.

**Live frontend:** [forge2-qualifier-tushar-singla.vercel.app](https://forge2-qualifier-tushar-singla.vercel.app)

> **Deployment note:** only the frontend is deployed live, on Vercel. The
> Laravel backend (PHP + SQLite) is not deployed — it runs locally only.
> Visiting the live frontend will load the UI, but API calls will fail
> until a backend is reachable. To see the full working app, run both
> the backend and frontend locally following the steps below.

## What it does

Boards → Lists → Cards, the core Trello loop:

- Create boards; each board has lists (e.g. To-Do / Doing / Done)
- Create, edit, and move cards between lists
- Card details: title + description, editable
- Coloured tags/labels on cards (e.g. "bug", "design")
- Add members to a board and assign them to cards
- Due dates on cards, with overdue cards visually flagged

This covers the 5 required features. Bonus features (drag-and-drop,
comments/activity, email alerts) were scoped out to prioritize a fully
working core over a partially-working extended feature set.

## Models used, and why

| Agent    | Role                          | Model                                      | Why |
|----------|--------------------------------|---------------------------------------------|-----|
| Hermes   | Planning / brain / memory     | `gemini-2.5-flash` (Google AI Studio)       | Fast, cheap reasoning model — sufficient for planning and orchestration, with comfortable headroom for a short hackathon build. |
| OpenClaw | Coding / execution            | Ollama — `qwen2.5:7b` (local) | Started on OpenRouter's free tier, but moved to a local Ollama model after hitting OpenRouter's free-tier rate limits and request timeouts mid-build. Local inference removes external rate limits entirely, trading some speed for reliability under a hard deadline. |

Full reasoning on the agent architecture and channel design lives in
[`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Run it locally

### Prerequisites

- PHP 8.2+
- Composer
- Node.js + npm
- (Backend uses SQLite — no separate database server needed)

### 1. Clone and enter the repo

```bash
git clone https://github.com/TR1CK5T4R/forge2-qualifier-TusharSingla.git
cd forge2-qualifier-TusharSingla
```

### 2. Start the backend (Laravel API)

```bash
cd backend
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve
```

The API runs at `http://localhost:8000`.

### 3. Start the frontend (React + Vite)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` (Vite will print the exact port
if it differs).

### 4. Open the app

Visit `http://localhost:5173` in your browser. The frontend talks to the
Laravel API automatically; no further configuration needed for local use.

## Project structure

```
forge2-qualifier-TusharSingla/
├── README.md              — this file
├── ARCHITECTURE.md        — agent roles, channel scheme, model routing
├── agent-log.md           — unedited log of the human/Hermes/OpenClaw loop
├── slack-export/          — screenshots: memory test, autonomous run, round-trip
├── skills/
│   └── status-report/
│       └── SKILL.md       — Hermes's reusable status-report skill
├── openclaw.json          — OpenClaw config (secrets removed)
├── .env.example           — placeholder env vars (real .env is never committed)
├── backend/               — Laravel API (PHP, SQLite)
├── frontend/              — React (Vite) UI
└── video/                 — link to the walkthrough video
```

## The agent loop

This project was built through a strict three-channel Slack pipeline,
not by hand-typing code:

```
Human posts a goal in #sprint-main
        ↓
Hermes posts a plan + task breakdown in #sprint-main
        ↓
Human reviews, approves, or corrects
        ↓
Hermes hands the task to OpenClaw in #agent-coder
        ↓
OpenClaw writes code, runs it, commits incrementally, and pushes
        ↓
OpenClaw reports back: What I Did / What's Left / What Needs Your Call
        ↓
Human approves or corrects → loop continues
```

See [`agent-log.md`](./agent-log.md) for the full, unedited transcript of
this loop in action — including the real debugging detours (rate limits,
timeouts, a misconfigured working directory, and a routing bug in
Laravel 11's `bootstrap/app.php`) that came up along the way.

## Video walkthrough

See [`video/`](./video/) for a short walkthrough of the agent loop and
the working app.

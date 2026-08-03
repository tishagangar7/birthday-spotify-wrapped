# actual life — Ali's 21st Birthday Wrapped

A Spotify-Wrapped-style birthday site for Ali: cinematic story chapters, an *actual life (2005–2026)* album by friends, and on-demand friend memory pages.

## Plan

See **[PLAN.md](./PLAN.md)** for the full creative + technical plan (chapter map, content brief, done vs left).

## Get all files (clone the repo)

```bash
git clone git@github.com:tishagangar7/actual-life-21.git
cd actual-life-21
```

Or with HTTPS:

```bash
git clone https://github.com/tishagangar7/actual-life-21.git
cd actual-life-21
```

If you’re a collaborator and don’t have access yet, ask the owner to invite you, then accept the email invite from GitHub before cloning.

In **VS Code**: `Cmd+Shift+P` → **Git: Clone** → paste  
`https://github.com/tishagangar7/actual-life-21.git` → open the folder when prompted.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| URL | What it is |
|-----|------------|
| `/` | Main Wrapped story deck |
| `/album` | Tracklist — tap a name to open that friend |
| `/album/[friend]` | Friend message + submit a memory |
| `/api/wrapped?mock=true` | Mock Wrapped JSON (no Spotify needed) |
| `/api/memories` | List / submit friend memories |

## Spotify (optional)

Live listening stats need a Spotify Developer app. Copy env and follow setup:

```bash
cp .env.example .env.local
```

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for Client ID, secret, redirect URI, and OAuth flow.

Without credentials, the site falls back to `?mock=true` automatically.

## Stack

- Next.js (App Router) + React
- Framer Motion transitions
- API routes: Spotify OAuth, `/api/wrapped`, `/api/memories`

## Notes

- Friend names are anonymized in the UI as Friend 1, Friend 2, … (Ali stays named).
- Submitted memories are stored in `data/submitted-memories.json` locally (gitignored; not durable on serverless without a real DB).
- Edit curated chapter copy in `data/wrappedChapters.js` and memories in `data/memories.js`.

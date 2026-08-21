# second-pen

Second Pen is a persistent author: dictate or type a brief, get a draft in your voice shaped for where it is going (Reel, web copy, manual, script), review by reading or listening, push it out. Not a template picker. Not a writing OS.

**Primary surface:** the phone. Desktop is the same product on a larger screen; the Mac app will use native File / Open / Close / Folder / Projects menus. In-window layout is still undecided — [holding hero](docs/UI:UX/holding-hero-reference.png) is reference only.

## Current state

Clickable stub in `web/`. Architecture is written. Eight-step assembly is **not** wired yet (intentional stub).

Canonical surface contract: [Blueprint](docs/BRAINSTORMING/Second-Pen-BLUEPRINT.md).

## Run locally

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000 — type or speak a brief, pick a destination, generate, listen, push (downloads `accepted.md`).

If `web/.env.local` has `LLM_API_KEY` or `OPENAI_API_KEY`, generate routes Luna/Terra/Sol then calls that model. If not, it returns a deterministic stub. Copy `web/.env.example`.

## Core loop

Quiet seed (not in this stub) → brief → destination-aware draft → listen/edit → push.

## Docs

**Product:** [Vision](docs/00_VISION/PRODUCT_VISION.md) · [Problem](docs/00_VISION/PROBLEM_STATEMENT.md) · [Jobs](docs/00_VISION/USER_JOBS.md) · [Features](docs/01_PRODUCT/FEATURES.md) · [Flows](docs/01_PRODUCT/USER_FLOWS.md) · [Desktop](docs/01_PRODUCT/DESKTOP_APP.md) · [Mobile](docs/01_PRODUCT/MOBILE_COMPANION.md) · [MVP](docs/06_ROADMAP/MVP.md)

**This slice:** [CLICKABLE_SLICE.md](docs/06_ROADMAP/CLICKABLE_SLICE.md)

**Engineering:** [Architecture](docs/02_ARCHITECTURE/ARCHITECTURE.md) · [Context assembly](docs/02_ARCHITECTURE/CONTEXT_ASSEMBLY.md) · [Data model](docs/02_ARCHITECTURE/DATA_MODEL.md) · [ADR log](docs/03_DECISIONS/ADR/README.md) · [Stack](docs/03_DECISIONS/STACK_DECISIONS.md) · [Guardrails](docs/03_DECISIONS/PROTOTYPE_GUARDRAILS.md)

## Stack

Cursor builds. Vercel hosts. Markdown is the writing. Neon indexes later. Generation: our policy router + OpenAI-compatible HTTP ([ADR-005](docs/03_DECISIONS/ADR/ADR-005-generation-adapter.md)). Browser STT/TTS. `.md` download on Push.

## Principle

During brainstorming, organize knowledge. During development, organize code.

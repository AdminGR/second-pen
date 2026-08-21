# Clickable slice — runbook

**Status:** GO. Do not stop to ask.  
**Date:** 2026-08-20  
**Stop condition:** local `npm run dev` works, then GitHub has the app, then a Vercel preview URL (if CLI auth exists) completes speak/type → draft → listen → download `.md`. Then **stop and report**.

This is a stub loop. Not eight-step assembly. ADR-001 is already accepted; that is not a blocker.

## Locked defaults (no questions)

| Item | Default |
|---|---|
| Location | `web/` — never overwrite root `docs/`, `README.md`, `AGENTS.md` |
| Stack | Next.js App Router, TypeScript, npm, React client page for mic/TTS |
| Layout | Two panels only: brief left, pinned draft right. **No icon rail, no Galaxy, no extra routes** |
| Visual | Black / white / gray, no glass, no polish |
| Destinations | `reel` \| `web_copy` \| `manual` \| `script` |
| STT | `webkitSpeechRecognition` / `SpeechRecognition`; if missing, typing still works |
| TTS | `window.speechSynthesis` |
| LLM | `POST /api/draft`. If `OPENAI_API_KEY` is set, call `gpt-4o-mini`. If not, return a deterministic destination-shaped stub. Never hang waiting for a key |
| Prompt | Temporary: write clearly and consistently, shaped for the destination. Comment `TEMPORARY STUB — not CONTEXT_ASSEMBLY.md` |
| Push | Client download of `accepted.md` with frontmatter; JSON in the page for generated / edited / accepted. No `fs.writeFile` on the server |
| Auth | None |
| Auto / Luna | Omitted; HTML comment that they are deferred |
| Package scripts | `cd web && npm run dev` → `http://localhost:3000` |
| Git | Commit and push to `origin` (`https://github.com/AdminGR/second-pen.git`) on `main` |
| Vercel | `cd web && npx vercel --yes` if logged in; if not, report local URL and that preview needs `npx vercel login`. Do not block the local loop |

## Out of slice

Context assembly, seed, Neon, R2, CLI Luna, destination adapters, critic loop, Option A rail, visual polish, extra pages.

## Report back

Preview URL (or local-only), whether OpenAI or stub was used, mic behavior, then stop.

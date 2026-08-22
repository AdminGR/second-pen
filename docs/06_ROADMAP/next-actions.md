# Next actions (agent-loop punch list)

**Status:** working checklist — rewrite this file at the end of every unattended iteration  
**Stop the product slice when:** speak/type → destination-shaped draft → listen → edit → download `accepted.md` works. Then stop adding features. See [CLICKABLE_SLICE.md](CLICKABLE_SLICE.md) and `AGENTS.md`.

## Done

- Two-panel stub in `web/` (notes + pinned draft). No rail, no Galaxy, no extra routes.
- Browser STT / TTS; typing works if mic is missing.
- Writing-mode pills and author/brand/system voice-lane pills as session parameters.
- `POST /api/draft` — policy router (`lib/route-job.ts`) then OpenAI-compatible HTTP (`lib/complete.ts`); deterministic stub if no key.
- Push downloads `accepted.md` with frontmatter + **Generated / Edited / Accepted** sections (`lib/push-md.ts`). Client-only Blob download; no `fs.writeFile` on the server.
- Verification scripts in `web/`: `lint` = `tsc --noEmit`; `test` = `tsx --test lib/smoke.test.ts` (smoke of `buildPushMarkdown`, `routeJob`, writing-mode helpers). `npm run build` / `lint` / `test` all green.

## Now (pick ONE per iteration)

1. **No product work.** Slice is complete — do not add seed, Neon, Galaxy, critic, Option A rail, extra pages, or context assembly.
2. **Only if red:** fix a failing `cd web && npm run build` (and `lint` / `test` if present). Otherwise no-op and leave this file alone aside from refreshing Last iteration.

## Slice complete?

Yes — clickable slice stopped.

## Needs a human decision (do not guess)

- Product name (“Second Pen” is a placeholder).
- Desktop layout lock (A / B / C vs two-panel as load-bearing). Holding hero is reference only.
- Mobile-native layout of the same loop (phone is the primary surface; not designed).
- Hosted LLM catalog default (OpenAI vs OpenRouter vs gateway) — `LLM_BASE_URL` is enough until an ADR.
- STT/TTS vendors beyond browser Web Speech.
- `.md` object store vendor (R2 vs Vercel Blob) — not this slice.

## Last iteration

- Verification no-op (2026-08-21): `cd web && npm run build`, `lint`, and `test` all green (Next.js build ok, `tsc --noEmit` clean, smoke 6/6). No code or product changes. Slice remains complete.

## Sensible next task

No-op unless `cd web && npm run build` (or lint/test) is red. Do not expand the product surface.

# Next actions (agent-loop punch list)

**Status:** working checklist — rewrite this file at the end of every unattended iteration  
**Stop the product slice when:** speak/type → destination-shaped draft → listen → edit → download `accepted.md` works. Then stop adding features. See [CLICKABLE_SLICE.md](CLICKABLE_SLICE.md) and `AGENTS.md`.

## Done

- Two-panel stub in `web/` (notes + pinned draft). No rail, no Galaxy, no extra routes.
- Browser STT / TTS; typing works if mic is missing.
- Writing-mode pills and author/brand/system voice-lane pills as session parameters.
- `POST /api/draft` — policy router (`lib/route-job.ts`) then OpenAI-compatible HTTP (`lib/complete.ts`); deterministic stub if no key.
- Push downloads `accepted.md` (body is the accepted text). Generated/edited also `console.info`’d, not yet in the file.

## Now (pick ONE per iteration)

1. **Push provenance in the downloaded `.md`.** Guardrail: Push stores generated + edited + accepted. Today the file is accepted-only. Put all three in the download (frontmatter + sections) without `fs.writeFile` on the server.
2. **Verification scripts in `web/`.** There is no `lint` or `test` script. Add the smallest gate the loop can run (`tsc --noEmit` as `lint` or `typecheck`; optional smoke test of `route-job` / writing-mode helpers). Do not add a test framework tour.
3. **Confirm `cd web && npm run build` is green** after any change. Fix what you broke.
4. **If 1–3 are done:** mark this slice complete below. Do **not** start seed, Neon, Galaxy, critic, Option A rail, extra pages, or context assembly.

## Slice complete?

No. Item 1 is still open.

When yes, replace this section with “Yes — clickable slice stopped.” and make no product-surface edits. Further iterations should no-op (or only fix a red build).

## Needs a human decision (do not guess)

- Product name (“Second Pen” is a placeholder).
- Desktop layout lock (A / B / C vs two-panel as load-bearing). Holding hero is reference only.
- Mobile-native layout of the same loop (phone is the primary surface; not designed).
- Hosted LLM catalog default (OpenAI vs OpenRouter vs gateway) — `LLM_BASE_URL` is enough until an ADR.
- STT/TTS vendors beyond browser Web Speech.
- `.md` object store vendor (R2 vs Vercel Blob) — not this slice.

## Last iteration

- (none yet — agent-loop has not run)

## Sensible next task

Push provenance in the downloaded `.md` (Now #1).

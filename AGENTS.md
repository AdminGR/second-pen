# second-pen Agent Guidance

second-pen is in a **clickable stub** slice. Architecture stands. Do not expand scope.

Preserve: product intent, architecture, ADRs, privacy, research, MVP boundaries, unresolved questions. Prefer updating the relevant document over new files.

Canonical surface: `docs/BRAINSTORMING/Second-Pen-BLUEPRINT.md`. Runbook: `docs/06_ROADMAP/CLICKABLE_SLICE.md`. App: `web/`.

The clickable slice **is allowed**. Do not add `dashboard/`, libraries, Galaxy, Option A rail, eight-step assembly, Neon, or CLI generation on Vercel. After speak/type → draft → listen → `.md` download works, **stop**.

## Prototype guardrails (literal)

- [ ] No new nav item, tab, or browsable list without an explicit call-out. Writing-mode pills and author/brand/system voice-lane pills are session parameters each write, not a library. Mac File / Folder / Projects are OS menus on desktop later, not an in-app rail in `web/`.
- [ ] Audience is inferred (assembly step 3), not a home-screen setting. Voice lane is a session click that chooses author vs brand vs system retrieval.
- [ ] Galaxy stays visualization-only until a written decision reopens it.
- [ ] Draft is a document, not a chat turn.
- [ ] Push stores generated + edited + accepted (download `.md` is the stub).
- [ ] Generated copy does not become authentic until accepted.
- [ ] Influence never merges into authentic voice; no influence UI in this slice.
- [ ] Bounded critic: not in this slice (zero critic calls).
- [ ] Human `.md` bodies are not overwritten by regeneration.
- [ ] Canonical store is Markdown; do not `fs.writeFile` on Vercel as the only copy.

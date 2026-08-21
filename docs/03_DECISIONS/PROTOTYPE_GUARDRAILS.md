# Prototype guardrails

Literal checks. Prototyping speed is when these get skipped. If a PR or a local spike fails a row, it does not ship.

Copy also lives in `AGENTS.md` so Cursor cannot “forget” it.

- [ ] **No new nav item, tab, or browsable list** without an explicit call-out in the change (why it is not a writing OS). Day / project / craft on a `.md` is storage metadata, not a browser.
- [ ] **Audience and guardrails stay in [context assembly](../02_ARCHITECTURE/CONTEXT_ASSEMBLY.md) steps 3 and 7.** If either appears as a home-screen setting, that is a flag, not a feature.
- [ ] **Galaxy is visualization-only** until a written decision reopens it. No Galaxy home, rail, or onboarding.
- [ ] **Draft is a document**, not a chat turn. Do not put the current draft only in a message log.
- [ ] **Push writes generated + edited + accepted.** A stub destination is fine. Export-only Push is not.
- [ ] **Generated copy does not become authentic** until accepted.
- [ ] **Influence never merges** into the authentic profile. No influence UI in the first slice.
- [ ] **Bounded critic:** one pass, one rewrite max. Auto is not an unbounded loop.
- [ ] **Human `.md` bodies are not overwritten** by regeneration unless the user overrode that in settings.
- [ ] **Canonical store is Markdown.** Indexes are disposable. Do not make Postgres the only copy of the writing.

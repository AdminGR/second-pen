# Prototype guardrails

Literal checks. Prototyping speed is when these get skipped. If a PR or a local spike fails a row, it does not ship.

Copy also lives in `AGENTS.md` so Cursor cannot “forget” it.

- [ ] **No new nav item, tab, or browsable list** without an explicit call-out in the change (why it is not a writing OS). Day / project / craft on a `.md` is storage metadata, not a browser. **Call-out:** Mac File / Open / Close / Folder / Projects are native OS menu items over files on disk, not an in-app library or Projects rail. Do not invent that rail in `web/`. **Call-out:** writing-mode pills and author/brand/system voice-lane pills are session parameters on every write, not onboarding and not a corpus/brand library.
- [ ] **Audience stays in [context assembly](../02_ARCHITECTURE/CONTEXT_ASSEMBLY.md) step 3** (inferred, not a home-screen setting). **Voice lane (author / brand / system) is a session control** — it chooses which assembly lane runs; it is not a settings wall of guardrail rules. Step 7 still loads register/guardrail *lists* from the store, not a CMS.
- [ ] **Galaxy is visualization-only** until a written decision reopens it. No Galaxy home, rail, or onboarding.
- [ ] **Draft is a document**, not a chat turn. Do not put the current draft only in a message log.
- [ ] **Push writes generated + edited + accepted.** A stub destination is fine. Export-only Push is not.
- [ ] **Generated copy does not become authentic** until accepted.
- [ ] **Influence never merges** into the authentic profile. No influence UI in the first slice.
- [ ] **Bounded critic:** one pass, one rewrite max. Auto is not an unbounded loop.
- [ ] **Human `.md` bodies are not overwritten** by regeneration unless the user overrode that in settings.
- [ ] **Canonical store is Markdown.** Indexes are disposable. Do not make Postgres the only copy of the writing.
- [ ] **Content calendars, slates, posting cadence, and scheduled runs** belong to a client of the engine ([ADR-006](ADR/ADR-006-content-driver-boundary.md)). The client contract is `brief_text` + `writing` + `voice` → `prose` + manifest. `routing_tier` stays engine policy.

# MVP

Source: [Path forward](../BRAINSTORMING/PATH_FORWARD.md) and [Architecture](../02_ARCHITECTURE/ARCHITECTURE.md). Hosting: [ADR-001](../03_DECISIONS/ADR/ADR-001-hosting-and-data-plane.md) Accepted. Scaffolding still needs an explicit start.

## Objective

Prove the persistent-author loop on one surface: a person can seed quietly, run one session, get a destination-aware draft in their voice, review by eye or ear, edit, and push — and the next comparable draft can improve because Push stored the delta.

## Must Have

- One user.
- Quiet authentic seed (paste or upload), not a library.
- Typed and dictated brief.
- Destination as a parameter (at least two of: Reel, web copy, manual, script) that changes mechanics, not only tone.
- Draft as a document identity (pinned, editable, versioned).
- Listen (TTS) and read/edit as equals.
- Push as commit: keep generated, edited, and accepted versions even if outbound delivery is a stub.
- Voice used under the surface. No profile workshop, no influence UI.
- Canonical persistence as Markdown (exportable). Indexes are not the only copy.
- Auto toggle and Luna / Terra / Sol routing (picker visible, not a settings tour).

## Should Have

- Inspectable provenance as a quiet affordance.
- Recent-session return without a CMS.
- One chosen desktop direction (A / B / C), or an explicit lock that two-panel is load-bearing.
- Mobile-native layout of the same loop.

## Not in MVP

- Dashboard, corpus library, influence workshop, evaluation lab.
- Gmail / LinkedIn / Docs / publish connectors.
- Template picker, content calendar, team workspaces.
- Multi-agent rewrite loops, fine-tuning, voice sharing.
- Frosted-glass UI.
- Galaxy as home, project-page UI, OAuth-on-first-login, webhook workers.

## Exit Criteria

The repository can leave Product Definition for architecture when all of these are true in the numbered product docs (they are, as of this promotion) and then written into architecture:

- The product is one session action with destination as a parameter.
- Draft is a document, not a chat turn.
- Push is the commit and the learning signal.
- Authentic, influence, and facts cannot be stored as one soup.
- STT and TTS are in the loop.
- Voice is seeded quietly; the library is not the product.
- `.md` is canonical; operational indexes rebuild.

Architecture docs now hold those rules. Implementation starts only after scaffolding is explicitly allowed (ADR-001 is accepted and does not by itself open `src/`).

The first slice is successful when a person can finish the primary flow without opening a library, a profile, or a settings tour — and a second session is observably using what they accepted in the first.

# Privacy

**Status:** first pass, tied to the durable layer

## Data Collected

- Briefs (typed or transcribed dictation)
- Drafts, edits, accepted copy
- Optional authentic seed writing
- Optional influence excerpts the user supplied
- Routing tier and Auto flag
- Later: SoR references, not the remote file as source of truth

Audio for STT/TTS is processed to produce or speak text. Canonical store is text. Derived audio is disposable.

## Data Stored

- Canonical: Markdown the person could still read if the app vanished
- Operational: embeddings, tags, summaries, graph cache — regenerable
- Human `.md` bodies are not overwritten by AI regeneration unless the user overrides that in settings

## Data Shared

- Model, STT, and TTS providers receive what the turn needs (brief, retrieved examples, draft). They do not own the store.
- External SoR: only after a connector exists, least scope

## Retention

- Accepted copy and seed persist until the person deletes them
- Generated-but-unaccepted drafts may expire; deletion must propagate to indexes
- Derived indexes may be wiped and rebuilt at any time

## User Controls

- Export of the Markdown tree
- Delete a `.md` with propagation
- Settings override for "allow AI to rewrite this human file" — default off
- Do not join generated drafts to authentic voice automatically

## Open Questions

- How long unaccepted drafts live
- Whether transcripts of dictation are kept as `.md` next to the brief (recommended: yes, they are text)

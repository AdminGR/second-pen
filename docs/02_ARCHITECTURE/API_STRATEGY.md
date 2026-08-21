# API Strategy

**Status:** first architecture iteration

The first slice can be a single Next.js application: UI + Route Handlers. Split only when a worker is required (index rebuild, later SoR sync).

## Internal APIs

Application-owned, not a public platform.

| Area | Job |
|---|---|
| Session | Create/update brief, destination, routing, Auto flag |
| Draft | Generate, list versions, patch human edits, listen (TTS), provenance |
| Push | Commit accepted copy; persist delta; stub outbound |
| Seed | Quiet paste/upload of authentic `.md` |
| Retrieve | Debug/inspect retrieved example ids (quiet) |
| Index | Rebuild from Markdown (admin / internal) |
| Events | Structured model events: create markdown, link, add relationship |

Generation is synchronous with a latency budget for Terra; Sol may be slower and should be labeled by routing, not by a spinner aesthetic that hides failure.

Model turns return:

- `prose` → draft body
- `events[]` → durable mutations
- `manifest` → provenance

Validate all model JSON with a runtime schema. Invalid events do not write.

## External APIs

Day one: none required for the loop (copy in/out is Markdown).

Later: OAuth-backed SoR APIs. Second Pen stores references, not the remote file as source of truth.

STT, TTS, and LLM providers are outbound adapters behind Luna / Terra / Sol / Auto. Transports may be HTTP or (inner loop only) an LLM CLI. The product API does not expose raw provider payloads to the client beyond routing tier and latency class. Hosted deploys do not spawn CLIs.

## Authentication

First prototype: one user. Do not build team workspaces.

Hosted prototype: authenticated user bound to a workspace. Row-level isolation in the operational database. Canonical `.md` paths are workspace-prefixed.

No demo `user_id` filter as the only control once hosted.

## Versioning

- Draft versions are files (`v1`, `v2`, …), not chat ids.
- Voice profile versions are derived snapshots with rollback.
- HTTP API: unversioned internal `/api/*` until a second client exists. Then additive `/v1`.

## Open Questions

- SSE vs wait-for-full-draft for generation (latency product requirement).
- Whether Listen is a URL to stored audio (disposable) or on-the-fly TTS from canonical text (preferred: text is source, audio is derived).
- Event idempotency keys when Auto splits a dump into many `.md`.

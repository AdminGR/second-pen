# System Boundaries

**Status:** first architecture iteration

## Desktop

Same product as mobile, larger reading surface. Hosts the hybrid working surface (input stream + pinned draft). May later host Galaxy as a quiet visualization. Does not own a separate data plane. Does not lead the information architecture.

**Mac shell:** native OS menu bar (File, Open, Close, Folder, Projects). Not in-window web chrome. Folder/Projects are disk operations on Markdown, not an in-app library. The `web/` stub on Vercel is not this shell. See [DESKTOP_APP.md](../01_PRODUCT/DESKTOP_APP.md).

## Mobile

Governing usage: dictation → destination → listen → push, one-handed. Same Session / Draft / Push identities. Must not require a desktop icon rail or a Galaxy home. Routing picker and Auto toggle need a mobile-native, compact form.

## Backend

Second Pen app: authn/z, session orchestration, retrieval, routing, generation, critic, STT/TTS proxy, Markdown write, index rebuild, structured events.

Does not: own Illustrator / Docs / CMS files; run unbounded agent loops; treat the operational database as the only copy of writing.

## Third-Party Services

| Service | Boundary | When |
|---|---|---|
| Model providers (Luna / Terra / Sol adapters) | Prompt + retrieved passages in; prose + structured events out | Day one |
| STT / TTS providers | Audio in/out | Day one |
| Object storage | Canonical `.md` | Day one of hosted prototype |
| Operational Postgres | Indexes, graph cache, embeddings | Day one of hosted prototype |
| Auth provider | Identity | When more than a local one-user prototype |
| Destination SoR (CMS, social, docs) | Push target | Week three+ |
| Authentic-source SoR (mail, Docs, LinkedIn) | Optional ingestion | After the session loop is real |

Oracle's agent-memory demo is a research reference, not a runtime dependency.

## Shared Responsibilities

- **Latency:** Experience requirement; backend and providers share the budget. Routing exists so Luna can take routine work.
- **Permissions:** App enforces workspace isolation. SoR connectors use least privilege when they exist.
- **Deletion:** Removing a `.md` must drop it from retrieval, embeddings, and derived profiles (flagged for recompute).
- **Provenance:** Every generated draft can name voice version, destination, source ids, model, routing tier.

## What stays outside

Galaxy-as-home, project-page clones, OAuth on first login, webhook workers, and a library browser. Those belong to later layers (5–6 and quiet experience corners), not the first slice.

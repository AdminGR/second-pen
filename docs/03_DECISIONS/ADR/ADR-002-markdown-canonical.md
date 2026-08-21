# ADR-002 — Markdown is canonical; indexes are disposable

## Status

Accepted

**Date:** 2026-08-20

## Context

The Blueprint's draft is a document identity. The kickoff stored writing in tables. The durable-layer rule is: Voice is the interface; text is the substrate; if the app disappears, history is still readable.

AI tags, summaries, embeddings, and clusters are useful and must not become the original.

## Decision

Canonical persistence is Markdown (or Markdown-compatible) files with relationships recorded as data that can be serialized (frontmatter + a relationship log or graph file that is itself text).

Search, graph cache, embeddings, and cluster assignments are rebuilt from that source. Human `.md` bodies are not overwritten by regeneration unless the user overrides that in settings.

Generated drafts are `.md` with `source_class: generated` until Push, when accepted copy becomes owned.

## Why

Matches copy in/out, Listen-from-text, export, and the "persistent author" as an accumulating folder of writing rather than a chat database.

## Alternatives Considered

- **Postgres rows as canonical:** simpler queries; app disappearance loses readable history without an exporter that always works.
- **Git-only:** excellent history; weak retrieval until an index exists anyway.

## Consequences

- Every feature that "stores writing" writes a `.md` first.
- Indexer is a first-class internal component.
- Galaxy, if built, reads the graph derived from files; it does not own nodes.

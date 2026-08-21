# Architecture Decision Records

One file per decision. Naming: `ADR-001-short-decision-name.md`

## Log

| ID | Status | Date | Decision |
|---|---|---|---|
| [ADR-001](ADR-001-hosting-and-data-plane.md) | Accepted | 2026-08-20 | Cursor builds; Vercel hosts; Markdown objects canonical; Neon FTS + pgvector indexes |
| [ADR-002](ADR-002-markdown-canonical.md) | Accepted | 2026-08-20 | Human `.md` is source of truth; indexes rebuild |
| [ADR-003](ADR-003-model-routing.md) | Accepted | 2026-08-20 | Auto toggle; Luna / Terra / Sol selection order |
| [ADR-004](ADR-004-llm-transport.md) | Accepted | 2026-08-20 | CLI inner loop; HTTP on Vercel; Cursor Agent is factory not engine |
| [ADR-005](ADR-005-generation-adapter.md) | Accepted | 2026-08-20 | Own the policy router; OpenAI-compatible HTTP; do not fork a 2024 router repo |

Open vendor rows (not ADRs yet): [STACK_DECISIONS.md](../STACK_DECISIONS.md).

Prototype checks: [PROTOTYPE_GUARDRAILS.md](../PROTOTYPE_GUARDRAILS.md).

## Template

# ADR-XXX — Decision

## Status

Proposed | Accepted | Revised | Superseded

## Context

## Decision

## Why

## Alternatives Considered

## Consequences

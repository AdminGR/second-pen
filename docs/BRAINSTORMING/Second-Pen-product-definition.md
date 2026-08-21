# Second Pen

> **Role:** engine / product-model noodling, not the surface contract.  
> **Read first:** [Second-Pen-BLUEPRINT.md](Second-Pen-BLUEPRINT.md) and [PATH_FORWARD.md](PATH_FORWARD.md).  
> The daily loop and first UI are defined there. This file is what happens under that loop.

## Current State

Prototype Architecture — subordinated to the Blueprint surface

## Product Definition

Second Pen is a memory-driven writing system that learns how a person actually communicates from their authentic writing, retrieves relevant examples for each assignment, applies explicit voice and format guardrails, and improves over time by studying the difference between its drafts and the user’s approved final work.

Second Pen does not rely on a generic instruction to “write like me.”

It builds an evidence-backed understanding of:

- how the user naturally writes;
- how the user communicates across different formats;
- how the user changes AI-generated drafts;
- which words, structures and habits the user avoids;
- which structural approaches the user admires in other writers;
- how those influences may guide a document without replacing the user’s authentic voice.

## Prototype Objective

The **engine** must be able to prove this pipeline (not as the UI):

**Import authentic writing → build a voice profile → add optional writing influences → retrieve relevant examples → generate a draft → capture the user’s edits → update memory conservatively → demonstrate improvement on the next draft**

The **product** first-proof is the Blueprint session, per [PATH_FORWARD.md](PATH_FORWARD.md):

**Quiet seed → brief (type or dictate) → destination-aware draft → listen/edit → push-as-commit → next draft improves**

Influence profiles and an evaluation harness are not a precondition of that session. They remain in this file as engine capability, not as v1 screens.

## Dual-Source Writing Model

Second Pen will maintain two deliberately separate source systems.

### 1. Authentic Writing Corpus

This contains writing authored by the user.

Examples include:

- LinkedIn posts;
- articles;
- newsletters;
- emails;
- social posts;
- scripts;
- founder communications;
- technical summaries;
- strategy documents;
- product descriptions;
- investor updates;
- uploaded text or Markdown documents;
- manually pasted writing;
- content imported from approved connected accounts.

This corpus answers:

> How does this person genuinely write?

It is the primary source for the user’s authentic voice profile.

### 2. Writing Influence Corpus

This contains approved writing from authors, journalists or other writers whose approach the user admires.

Examples include:

- a journalist whose argument structure the user likes;
- an author whose narrative pacing the user prefers;
- a columnist whose introductions are effective;
- a technical writer whose explanations are unusually clear;
- a founder whose communications are direct and economical;
- an uploaded or linked body of work the user has permission to analyze.

This corpus answers:

> What writing techniques or structural approaches would the user like to draw from?

Influence sources must remain separate from the user’s authentic corpus.

Second Pen should extract higher-level characteristics such as:

- argument structure;
- narrative pacing;
- paragraph rhythm;
- degree of directness;
- use of examples;
- opening style;
- transitions;
- explanatory sequence;
- density;
- formality;
- conclusion style.

The system should not treat another writer’s distinctive phrases as the user’s own language or reproduce source passages unnecessarily.

## Voice Assembly Order

For each writing task, Second Pen should assemble context in this order:

1. User’s authentic voice
2. Communication objective
3. Intended audience
4. Document format
5. Relevant authentic examples
6. Optional influence profile
7. Explicit writing guardrails
8. Relevant factual or subject-matter context

The user’s authentic voice remains the dominant layer.

## Core Memory Model

Second Pen uses three persistent memory layers:

### Episodic Memory

Stores authentic writing, approved final documents, relevant passages and the user’s previous corrections.

### Semantic Memory

Stores structured descriptions of voice, format preferences, writing techniques, prohibited habits and optional influence profiles.

### Reflective Memory

Stores evidence-backed observations about how the user’s writing changes over time and maintains a rollback history of all profile updates.

## Critical Learning Signal

Second Pen must not merely learn from what the user eventually publishes.

It must learn from:

**Generated draft → user edit → approved final version**

The difference between the generated draft and the user-approved version reveals:

- unwanted phrases;
- excessive explanation;
- weak openings;
- incorrect tone;
- structural preferences;
- vocabulary changes;
- unnecessary headings;
- preferred sentence length;
- preferred directness;
- recurring corrections.

This edit history is one of the product’s most valuable proprietary learning signals.

## Prototype Scope

Engine capability for a narrow prototype. Items marked *quiet* are not first-class screens.

- one authenticated or prototype user;
- manually pasted writing and text/Markdown uploads (*quiet seed*);
- authentic-source classification;
- influence-source classification (lane reserved; no v1 UI);
- source ownership and provenance;
- one authentic voice profile (*used, not edited as a workshop*);
- optional influence profiles (*later than first session proof*);
- destinations: Reel, web copy, manual, script (not email/social as the first pair);
- semantic retrieval;
- structured drafting;
- one bounded critique and revision loop;
- draft-to-final comparison bound to Push;
- conservative reflection (*runs on Push; user-facing rollback later*);
- profile history and rollback (*derived*);
- a fixed evaluation set (*internal / `prototypes/` only*).

## Deferred Scope

The first prototype should not require:

- Gmail integration;
- LinkedIn API integration;
- Google Docs integration;
- automated web crawling;
- automated social publishing;
- team workspaces;
- a browser extension;
- unlimited model providers;
- public author marketplaces;
- voice-profile sharing;
- complex multi-agent orchestration;
- model fine-tuning.

## Documentation

- [Architecture](../02_ARCHITECTURE/ARCHITECTURE.md)
- Product work: `docs/01_PRODUCT/`
- Architecture decisions: `docs/03_DECISIONS/ADR/`
- Risk and security: `docs/04_RISK_SECURITY/`
- Research references: `docs/05_RESEARCH/`
- Roadmap: `docs/06_ROADMAP/`
- Experiments: `prototypes/`

## Working Principle

The system should remain inspectable.

Every generated draft should be able to explain:

- which authentic examples were retrieved;
- which voice-profile version was used;
- which influence profile was selected;
- which guardrails were applied;
- which model generated the draft;
- which critique caused a revision;
- which user edits became learning signals.

## Current Phase Gate

Superseded for sequencing by [PATH_FORWARD.md](PATH_FORWARD.md).

Still required before implementation: authentic vs influence vs facts cannot be accidentally merged. Not required before the first session proof: a complete influence-ingestion UI, or a product evaluation harness.

The engine remains ready when the repository defines ingestion, dual-source separation, three memory kinds, draft/revision, reflection/rollback, evaluation (internal), and privacy/provenance — as architecture, not as screens.

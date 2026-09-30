/**
 * Smallest smoke gate for the clickable stub — node:test via tsx, no framework tour.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDraftManifest, buildDraftRequest } from "./draft-contract";
import { buildPushMarkdown } from "./push-md";
import { HEAVY_BRIEF_CHARS, routeJob } from "./route-job";
import {
  DEFAULT_WRITING,
  isStructuralWriting,
  isWritingKind,
  writingLabel,
} from "./writing-mode";

describe("buildPushMarkdown", () => {
  it("includes frontmatter and Generated / Edited / Accepted sections", () => {
    const md = buildPushMarkdown({
      generated: "gen line",
      edited: "edit line",
      accepted: "accept line",
      writing: "editorial_short",
      voice: "author_writing",
    });
    assert.match(md, /^---\n/);
    assert.match(md, /versions: generated, edited, accepted/);
    assert.match(md, /## Generated\n\ngen line/);
    assert.match(md, /## Edited\n\nedit line/);
    assert.match(md, /## Accepted\n\naccept line/);
  });
});

describe("routeJob", () => {
  it("routes internal to luna and seed to sol", () => {
    assert.equal(routeJob({ job: "internal" }).tier, "luna");
    assert.equal(routeJob({ job: "seed" }).tier, "sol");
  });

  it("honors user pin on drafts", () => {
    assert.equal(routeJob({ job: "draft", pin: "luna" }).tier, "luna");
  });

  it("sends long structural drafts to sol", () => {
    const brief = "x".repeat(HEAVY_BRIEF_CHARS);
    const result = routeJob({
      job: "draft",
      writing: "editorial_long",
      brief,
    });
    assert.equal(result.tier, "sol");
    assert.equal(result.reason, "long structural draft");
  });

  it("defaults short drafts to terra", () => {
    assert.equal(routeJob({ job: "draft", writing: DEFAULT_WRITING }).tier, "terra");
  });
});

describe("writing-mode helpers", () => {
  it("recognizes default writing kind and labels", () => {
    assert.equal(isWritingKind(DEFAULT_WRITING), true);
    assert.equal(isWritingKind("not-a-kind"), false);
    assert.equal(isStructuralWriting("editorial_long"), true);
    assert.equal(isStructuralWriting("editorial_short"), false);
    assert.equal(writingLabel("editorial_short").cta, "Editorial · Short form");
  });
});

describe("draft contract", () => {
  it("maps brief_text to a brief body and rejects extras", () => {
    const body = buildDraftRequest({
      brief_text: "  Say the launch in one breath.  ",
      writing: "script",
      voice: "author_writing",
    });
    assert.deepEqual(body, {
      brief: "Say the launch in one breath.",
      writing: "script",
      voice: "author_writing",
    });
    assert.deepEqual(Object.keys(body).sort(), ["brief", "voice", "writing"]);
  });

  it("rejects an empty brief, an unknown kind, and an unknown voice", () => {
    assert.throws(
      () => buildDraftRequest({ brief_text: "  ", writing: "script", voice: "author_writing" }),
      /brief_text required/,
    );
    assert.throws(
      () => buildDraftRequest({ brief_text: "Hello", writing: "linkedin_post", voice: "author_writing" }),
      /unknown writing/,
    );
    assert.throws(
      () => buildDraftRequest({ brief_text: "Hello", writing: "script", voice: "notes/voice.md" }),
      /unknown voice/,
    );
  });

  it("builds a generated episodic manifest from the engine response", () => {
    const manifest = buildDraftManifest({
      prose: "Open on the bench.",
      stub: true,
      tier: "terra",
      model: "gpt-4o-mini",
      reason: "default draft",
      writing: "script",
      voice: "author_writing",
    });
    assert.deepEqual(manifest, {
      writing: "script",
      voice: "author_writing",
      tier: "terra",
      model: "gpt-4o-mini",
      reason: "default draft",
      stub: true,
      source_class: "generated",
      memory_kind: "episodic",
    });
  });

  it("rejects an empty prose payload", () => {
    assert.throws(
      () =>
        buildDraftManifest({
          prose: "  ",
          stub: true,
          tier: "terra",
          model: "gpt-4o-mini",
          reason: "default draft",
          writing: "script",
          voice: "author_writing",
        }),
      /prose required/,
    );
  });
});

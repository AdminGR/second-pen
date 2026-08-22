/**
 * Smallest smoke gate for the clickable stub — node:test via tsx, no framework tour.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
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

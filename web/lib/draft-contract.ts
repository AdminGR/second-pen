import { type Tier } from "./route-job";
import { isVoiceHarness, type VoiceHarness } from "./voice-lane";
import { isWritingKind, type WritingKind } from "./writing-mode";

export type DraftContractInput = {
  brief_text: string;
  writing: string;
  voice: string;
};

export type DraftRequestBody = {
  brief: string;
  writing: WritingKind;
  voice: VoiceHarness;
};

export type DraftEngineResponse = {
  prose: string;
  stub: boolean;
  tier: Tier;
  model: string;
  reason: string;
  writing: WritingKind;
  voice: VoiceHarness;
};

export type DraftManifest = {
  writing: WritingKind;
  voice: VoiceHarness;
  tier: Tier;
  model: string;
  reason: string;
  stub: boolean;
  source_class: "generated";
  memory_kind: "episodic";
};

export function buildDraftRequest(input: DraftContractInput): DraftRequestBody {
  const brief = input.brief_text.trim();
  if (!brief) {
    throw new Error("brief_text required");
  }
  if (!isWritingKind(input.writing)) {
    throw new Error("unknown writing");
  }
  if (!isVoiceHarness(input.voice)) {
    throw new Error("unknown voice");
  }
  return { brief, writing: input.writing, voice: input.voice };
}

export function buildDraftManifest(response: DraftEngineResponse): DraftManifest {
  if (typeof response.prose !== "string") {
    throw new Error("prose required");
  }
  const prose = response.prose.trim();
  if (!prose) {
    throw new Error("prose required");
  }
  return {
    writing: response.writing,
    voice: response.voice,
    tier: response.tier,
    model: response.model,
    reason: response.reason,
    stub: response.stub,
    source_class: "generated",
    memory_kind: "episodic",
  };
}

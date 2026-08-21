import { isRegisterHeavy, type VoiceHarness } from "./voice-lane";
import {
  DEFAULT_WRITING,
  isStructuralWriting,
  type WritingKind,
} from "./writing-mode";

export type JobKind = "internal" | "draft" | "seed" | "reflect";
export type Tier = "luna" | "terra" | "sol";
export type { WritingKind };

export type RouteInput = {
  job: JobKind;
  writing?: WritingKind;
  voice?: VoiceHarness;
  brief?: string;
  pin?: Tier;
};

export type RouteResult = {
  tier: Tier;
  reason: string;
};

export const HEAVY_BRIEF_CHARS = 2400;

export function routeJob(input: RouteInput): RouteResult {
  switch (input.job) {
    case "internal":
      return { tier: "luna", reason: "internal job" };
    case "seed":
    case "reflect":
      return { tier: "sol", reason: "seed or reflection" };
    case "draft":
      return routeDraft(input);
    default: {
      const _exhaustive: never = input.job;
      return _exhaustive;
    }
  }
}

function routeDraft(input: RouteInput): RouteResult {
  if (input.pin) {
    return { tier: input.pin, reason: "user pin" };
  }

  const writing = input.writing ?? DEFAULT_WRITING;
  const long = (input.brief?.length ?? 0) >= HEAVY_BRIEF_CHARS;
  const heavy = isStructuralWriting(writing) || (input.voice ? isRegisterHeavy(input.voice) : false);

  if (long && heavy) {
    return { tier: "sol", reason: "long structural draft" };
  }

  return { tier: "terra", reason: "default draft" };
}

export function modelFor(tier: Tier): string {
  switch (tier) {
    case "luna":
      return process.env.MODEL_LUNA?.trim() || "gpt-4o-mini";
    case "terra":
      return process.env.MODEL_TERRA?.trim() || "gpt-4o-mini";
    case "sol":
      return process.env.MODEL_SOL?.trim() || "gpt-4o";
    default: {
      const _exhaustive: never = tier;
      return _exhaustive;
    }
  }
}

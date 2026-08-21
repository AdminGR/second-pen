import { NextResponse } from "next/server";
import { completeChat, llmCredentials } from "@/lib/complete";
import { modelFor, routeJob } from "@/lib/route-job";
import {
  DEFAULT_VOICE,
  isVoiceHarness,
  voiceMechanics,
  type VoiceHarness,
} from "@/lib/voice-lane";
import {
  DEFAULT_WRITING,
  isWritingKind,
  writingMechanics,
  type WritingKind,
} from "@/lib/writing-mode";

function stubProse(brief: string, writing: WritingKind, voice: VoiceHarness): string {
  return [
    `[stub · ${writing} · ${voice}]`,
    `Shaped for ${writingMechanics(writing)}.`,
    voiceMechanics(voice),
    brief.trim(),
  ].join("\n\n");
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    brief?: string;
    writing?: string;
    voice?: string;
  };
  const brief = body.brief?.trim() ?? "";
  const writing: WritingKind = isWritingKind(body.writing) ? body.writing : DEFAULT_WRITING;
  const voice: VoiceHarness = isVoiceHarness(body.voice) ? body.voice : DEFAULT_VOICE;
  if (!brief) {
    return NextResponse.json({ error: "brief required" }, { status: 400 });
  }

  const routed = routeJob({ job: "draft", writing, voice, brief });
  const model = modelFor(routed.tier);
  const mechanics = writingMechanics(writing);
  const lane = voiceMechanics(voice);

  if (!llmCredentials()) {
    return NextResponse.json({
      prose: stubProse(brief, writing, voice),
      stub: true,
      tier: routed.tier,
      model,
      reason: routed.reason,
      writing,
      voice,
    });
  }

  // TEMPORARY — not CONTEXT_ASSEMBLY.md. One call, no critic, no retrieval yet.
  const result = await completeChat({
    model,
    system: `Write clearly and consistently. Mode: ${writing} (${mechanics}). Voice lane: ${voice} (${lane}). Stay inside both constraints. Return only the draft.`,
    user: brief,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error: "llm failed",
        detail: result.error,
        tier: routed.tier,
        model,
        writing,
        voice,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    prose: result.prose,
    stub: false,
    tier: routed.tier,
    model,
    reason: routed.reason,
    writing,
    voice,
  });
}

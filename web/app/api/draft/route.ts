import { NextResponse } from "next/server";

type Destination = "reel" | "web_copy" | "manual" | "script";

const MECHANICS: Record<Destination, string> = {
  reel: "short spoken lines, pauses, no long paragraphs",
  web_copy: "scannable web paragraph, one idea per sentence",
  manual: "numbered or stepped instructional prose, concrete verbs",
  script: "spoken script with brief beats, hearable rhythm",
};

function stubProse(brief: string, destination: Destination): string {
  return [
    `[stub · ${destination}]`,
    `Shaped for ${MECHANICS[destination]}.`,
    brief.trim(),
  ].join("\n\n");
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    brief?: string;
    destination?: Destination;
  };
  const brief = body.brief?.trim() ?? "";
  const destination = body.destination ?? "web_copy";
  if (!brief) {
    return NextResponse.json({ error: "brief required" }, { status: 400 });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({
      prose: stubProse(brief, destination),
      stub: true,
    });
  }

  // TEMPORARY STUB — not CONTEXT_ASSEMBLY.md. One call, no critic, no retrieval.
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `Write clearly and consistently, shaped for ${destination} (${MECHANICS[destination]}). Do not claim a personal voice. Return only the draft.`,
        },
        { role: "user", content: brief },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: "openai failed", detail: err.slice(0, 300) },
      { status: 502 },
    );
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const prose = data.choices?.[0]?.message?.content?.trim();
  if (!prose) {
    return NextResponse.json({ error: "empty model response" }, { status: 502 });
  }

  return NextResponse.json({ prose, stub: false });
}

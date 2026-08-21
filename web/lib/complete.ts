const DEFAULT_BASE = "https://api.openai.com/v1";

export type CompleteInput = {
  model: string;
  system: string;
  user: string;
};

export type CompleteResult =
  | { ok: true; prose: string }
  | { ok: false; error: string };

export function llmCredentials(): { key: string; baseUrl: string } | null {
  const key = process.env.LLM_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  const baseUrl = (process.env.LLM_BASE_URL?.trim() || DEFAULT_BASE).replace(/\/$/, "");
  return { key, baseUrl };
}

export async function completeChat(input: CompleteInput): Promise<CompleteResult> {
  const creds = llmCredentials();
  if (!creds) {
    return { ok: false, error: "no llm key" };
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${creds.key}`,
    "Content-Type": "application/json",
  };
  if (creds.baseUrl.includes("openrouter.ai")) {
    headers["HTTP-Referer"] = process.env.SITE_URL?.trim() || "http://localhost:3000";
    headers["X-Title"] = "Second Pen";
  }

  const res = await fetch(`${creds.baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: input.model,
      temperature: 0.4,
      messages: [
        { role: "system", content: input.system },
        { role: "user", content: input.user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err.slice(0, 300) };
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const prose = data.choices?.[0]?.message?.content?.trim();
  if (!prose) {
    return { ok: false, error: "empty model response" };
  }
  return { ok: true, prose };
}

import type { CoachProviderInput, CoachProviderOutput } from "@/types/coach";
import type { CoachProvider } from "@/lib/coach/providers/provider";

export class RemoteCoachProvider implements CoachProvider {
  readonly name = "aera-remote";

  constructor(private readonly endpoint: string, private readonly apiKey: string) {}

  async complete(input: CoachProviderInput): Promise<CoachProviderOutput> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        instruction: "Be concise, supportive, explain recommendations, never invent user data, and use uncertainty appropriately.",
        ...input,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`Coach provider returned ${response.status}`);
    const payload: unknown = await response.json();
    if (!isProviderPayload(payload)) throw new Error("Coach provider returned an invalid response");
    return { content: payload.content.trim(), actions: [], provider: this.name };
  }
}

function isProviderPayload(value: unknown): value is { content: string } {
  return Boolean(value && typeof value === "object" && "content" in value && typeof value.content === "string" && value.content.trim());
}

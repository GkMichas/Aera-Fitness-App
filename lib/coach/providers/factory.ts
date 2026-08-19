import { LocalCoachProvider } from "@/lib/coach/providers/local-provider";
import { RemoteCoachProvider } from "@/lib/coach/providers/remote-provider";
import type { CoachProvider } from "@/lib/coach/providers/provider";

export function createCoachProvider(): CoachProvider {
  const endpoint = process.env.AERA_COACH_PROVIDER_URL;
  const apiKey = process.env.AERA_COACH_PROVIDER_KEY;
  return endpoint && apiKey ? new RemoteCoachProvider(endpoint, apiKey) : new LocalCoachProvider();
}

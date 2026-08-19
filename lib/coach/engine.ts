import { actionsForIntent } from "@/lib/coach/actions";
import { buildCoachContext } from "@/lib/coach/context-builder";
import { routeCoachIntent } from "@/lib/coach/intent-router";
import type { CoachProvider } from "@/lib/coach/providers/provider";
import type { CoachMessage, UserContextSnapshot } from "@/types/coach";

export async function runCoach(input: {
  message: string;
  snapshot: UserContextSnapshot;
  recentMessages?: Pick<CoachMessage, "role" | "content">[];
  provider: CoachProvider;
}) {
  const intent = routeCoachIntent(input.message);
  const context = buildCoachContext(intent, input.snapshot);
  if (intent === "health_safety") {
    return {
      content: "This may need health-specific guidance, so I won’t treat it as an ordinary coaching question. If symptoms are severe, sudden or getting worse, contact local emergency services or a qualified healthcare professional now.",
      actions: actionsForIntent(intent),
      provider: "aera-safety-hold",
      intent,
      contextManifest: context.domains,
    };
  }
  const response = await input.provider.complete({ message: input.message, intent, context, recentMessages: (input.recentMessages ?? []).slice(-8) });
  return { ...response, actions: actionsForIntent(intent), intent, contextManifest: context.domains };
}

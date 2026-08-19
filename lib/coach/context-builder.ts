import type { CoachIntent, ContextDomain, SelectedCoachContext, UserContextSnapshot } from "@/types/coach";

const policy: Record<CoachIntent, ContextDomain[]> = {
  training: ["profile", "goals", "recentWorkouts", "latestCheckIn", "preferences", "equipment", "trainingSchedule", "memory"],
  nutrition: ["goals", "recentMeals", "nutritionTarget", "preferences", "memory"],
  progress: ["goals", "measurements", "recentWorkouts", "recentMeals", "memory"],
  recovery: ["recentWorkouts", "latestCheckIn", "trainingSchedule", "memory"],
  general: ["profile", "goals", "latestCheckIn", "memory"],
  health_safety: [],
};

export const contextPolicy = policy;

export function buildCoachContext(intent: CoachIntent, snapshot: UserContextSnapshot): SelectedCoachContext {
  const domains = policy[intent];
  const data: Partial<UserContextSnapshot> = {};
  for (const domain of domains) {
    const value = snapshot[domain];
    if (value === undefined) continue;
    if (domain === "memory") {
      const allowedIntent = intent === "health_safety" ? null : intent;
      data.memory = snapshot.memory?.filter((fact) => fact.scope === allowedIntent).slice(0, 5);
      if (!data.memory?.length) delete data.memory;
      continue;
    }
    Object.assign(data, { [domain]: value });
  }
  return { intent, domains: Object.keys(data) as ContextDomain[], data };
}

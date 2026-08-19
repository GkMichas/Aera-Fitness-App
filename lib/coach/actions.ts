import type { CoachAction, CoachIntent } from "@/types/coach";

const actions: Record<Exclude<CoachIntent, "general">, CoachAction[]> = {
  training: [{ kind: "view_workout", label: "View workout", href: "/training/program", description: "Open your current training plan" }],
  nutrition: [{ kind: "open_meal_plan", label: "Open meal plan", href: "/nutrition/plan" }, { kind: "log_meal", label: "Log meal", href: "/nutrition/log" }],
  progress: [{ kind: "open_progress", label: "View progress", href: "/progress" }],
  recovery: [{ kind: "recovery_tips", label: "Recovery tips", href: "/weekly-review" }, { kind: "view_workout", label: "View workout", href: "/training/program" }],
  health_safety: [{ kind: "open_health", label: "Open AERA Health", href: "/health" }],
};

export function actionsForIntent(intent: CoachIntent): CoachAction[] {
  return intent === "general" ? [] : actions[intent];
}

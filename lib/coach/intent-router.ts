import type { CoachIntent } from "@/types/coach";

const patterns: { intent: CoachIntent; terms: RegExp[] }[] = [
  { intent: "health_safety", terms: [/\b(chest pain|cannot breathe|can'?t breathe|fainted|unconscious|severe bleeding|suicid|overdose)\b/i, /\b(diagnos|medication|symptom|injur(?:y|ed)|sharp pain|dizzy|numbness)\b/i] },
  { intent: "recovery", terms: [/\b(sore|soreness|sleep|slept|tired|fatigue|recover|recovery|rest day|stress)\b/i] },
  { intent: "nutrition", terms: [/\b(eat|food|meal|protein|calorie|macro|diet|hungry|breakfast|lunch|dinner|snack)\b/i] },
  { intent: "progress", terms: [/\b(weight|waist|progress|plateau|stalled|dropping|trend|measurement|review)\b/i] },
  { intent: "training", terms: [/\b(train|training|workout|exercise|sets?|reps?|shoulders?|legs?|chest|gym|strength)\b/i] },
];

export function routeCoachIntent(message: string): CoachIntent {
  const normalized = message.trim();
  for (const group of patterns) if (group.terms.some((pattern) => pattern.test(normalized))) return group.intent;
  return "general";
}

export type CoachIntent = "training" | "nutrition" | "progress" | "recovery" | "general" | "health_safety";
export type ContextDomain = "profile" | "goals" | "measurements" | "recentWorkouts" | "recentMeals" | "nutritionTarget" | "latestCheckIn" | "preferences" | "equipment" | "trainingSchedule" | "memory";
export type CoachActionKind = "view_workout" | "open_meal_plan" | "log_meal" | "recovery_tips" | "open_progress" | "open_health";

export interface CoachAction {
  kind: CoachActionKind;
  label: string;
  href: string;
  description?: string;
}

export interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  intent?: CoachIntent;
  actions?: CoachAction[];
}

export interface UserContextSnapshot {
  profile?: { firstName?: string; heightCm?: number; currentWeightKg?: number };
  goals?: { primaryGoal?: string; targetWeightKg?: number };
  measurements?: { weightKg?: number; waistCm?: number; measuredAt?: string }[];
  recentWorkouts?: { name: string; status: string; performedAt?: string; durationMinutes?: number }[];
  recentMeals?: { name: string; calories?: number; proteinG?: number; loggedAt?: string }[];
  nutritionTarget?: { calories?: number; proteinG?: number; carbsG?: number; fatG?: number };
  latestCheckIn?: { energy?: number; sleepQuality?: number; stress?: number; soreness?: number; checkInDate?: string };
  preferences?: { sessionDurationMinutes?: number; dietaryPreferences?: string[]; allergies?: string[] };
  equipment?: string[];
  trainingSchedule?: { daysPerWeek?: number; nextWorkout?: string };
  memory?: { key: string; summary: string; scope: Exclude<CoachIntent, "health_safety"> }[];
}

export interface SelectedCoachContext {
  intent: CoachIntent;
  domains: ContextDomain[];
  data: Partial<UserContextSnapshot>;
}

export interface CoachProviderInput {
  message: string;
  intent: Exclude<CoachIntent, "health_safety">;
  context: SelectedCoachContext;
  recentMessages: Pick<CoachMessage, "role" | "content">[];
}

export interface CoachProviderOutput {
  content: string;
  actions: CoachAction[];
  provider: string;
}

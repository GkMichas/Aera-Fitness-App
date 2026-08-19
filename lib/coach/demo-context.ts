import type { UserContextSnapshot } from "@/types/coach";

export const demoCoachContext: UserContextSnapshot = {
  profile: { firstName: "George", heightCm: 181, currentWeightKg: 84.2 },
  goals: { primaryGoal: "build muscle", targetWeightKg: 86 },
  measurements: [{ weightKg: 84.2, waistCm: 84.6, measuredAt: "2026-08-18" }, { weightKg: 84.1, waistCm: 85.2, measuredAt: "2026-08-11" }],
  recentWorkouts: [{ name: "Lower Strength", status: "completed", performedAt: "2026-08-18", durationMinutes: 52 }],
  recentMeals: [{ name: "Greek Yogurt Bowl", calories: 432, proteinG: 31.2 }, { name: "Chicken Pita", calories: 552, proteinG: 58.2 }],
  nutritionTarget: { calories: 2240, proteinG: 170, carbsG: 220, fatG: 72 },
  latestCheckIn: { energy: 7, sleepQuality: 6, stress: 4, soreness: 5, checkInDate: "2026-08-19" },
  preferences: { sessionDurationMinutes: 45, dietaryPreferences: [], allergies: [] },
  equipment: ["adjustable dumbbells", "bench", "resistance bands"],
  trainingSchedule: { daysPerWeek: 4, nextWorkout: "Upper Body" },
  memory: [
    { key: "training_time", summary: "Prefers training sessions under 45 minutes on weekdays.", scope: "training" },
    { key: "nutrition_breakfast", summary: "Usually prefers a high-protein breakfast.", scope: "nutrition" },
    { key: "recovery_schedule", summary: "Prefers moving a session rather than skipping the training week.", scope: "recovery" },
  ],
};

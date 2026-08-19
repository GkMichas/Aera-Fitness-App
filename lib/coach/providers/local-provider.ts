import type { CoachProviderInput, CoachProviderOutput } from "@/types/coach";
import type { CoachProvider } from "@/lib/coach/providers/provider";

export class LocalCoachProvider implements CoachProvider {
  readonly name = "aera-local";

  async complete(input: CoachProviderInput): Promise<CoachProviderOutput> {
    const data = input.context.data;
    let content: string;

    switch (input.intent) {
      case "training": {
        const next = data.trainingSchedule?.nextWorkout;
        const minutes = data.preferences?.sessionDurationMinutes;
        const soreness = data.latestCheckIn?.soreness;
        content = next
          ? `Your next planned session is ${next}${minutes ? `, built for about ${minutes} minutes` : ""}. ${soreness ? `Your latest soreness check-in is ${soreness}/10, so use the warm-up to reassess before increasing effort.` : "Start with the planned warm-up and adjust effort from there."}`
          : "I do not have a confirmed next workout in the selected context yet. Open your training plan and I can help you adjust it.";
        break;
      }
      case "nutrition": {
        const target = data.nutritionTarget;
        const meals = data.recentMeals ?? [];
        const consumedCalories = meals.reduce((sum, meal) => sum + (meal.calories ?? 0), 0);
        const consumedProtein = meals.reduce((sum, meal) => sum + (meal.proteinG ?? 0), 0);
        if (target?.calories && target.proteinG !== undefined) {
          const remainingCalories = Math.max(0, Math.round(target.calories - consumedCalories));
          const remainingProtein = Math.max(0, Number((target.proteinG - consumedProtein).toFixed(1)));
          content = `Based on the meals currently available, you have an estimated ${remainingCalories} kcal and ${remainingProtein} g protein remaining. A protein-led meal from your plan is the clearest next choice.`;
        } else content = "I do not have a confirmed nutrition target in the selected context yet. Set your target before using remaining-calorie recommendations.";
        break;
      }
      case "progress": {
        const [latest, previous] = data.measurements ?? [];
        if (latest?.weightKg !== undefined && previous?.weightKg !== undefined) {
          const weightChange = Number((latest.weightKg - previous.weightKg).toFixed(1));
          const waistChange = latest.waistCm !== undefined && previous.waistCm !== undefined ? Number((latest.waistCm - previous.waistCm).toFixed(1)) : null;
          content = `Your two latest records show weight ${formatChange(weightChange, "kg")}${waistChange === null ? "." : ` and waist ${formatChange(waistChange, "cm")}.`} That is a short window, so keep collecting consistent measurements before changing the plan.`;
        } else content = "There are not enough measurements in the selected context to calculate a reliable trend yet. Add another consistent check-in first.";
        break;
      }
      case "recovery": {
        const checkIn = data.latestCheckIn;
        if (checkIn) content = `Your latest check-in shows soreness ${checkIn.soreness ?? "not recorded"}/10, sleep ${checkIn.sleepQuality ?? "not recorded"}/10 and energy ${checkIn.energy ?? "not recorded"}/10. Keep today's effort flexible and stop if ordinary soreness becomes sharp or worsening pain.`;
        else content = "I do not have a recent recovery check-in in the selected context. Log sleep, energy and soreness before adjusting today's session.";
        break;
      }
      default:
        content = data.profile?.firstName ? `I’m here, ${data.profile.firstName}. Ask about your training, nutrition, recovery or progress and I’ll use only the relevant records.` : "Ask about your training, nutrition, recovery or progress and I’ll use only the relevant records.";
    }

    return { content, actions: [], provider: this.name };
  }
}

function formatChange(value: number, unit: string) {
  if (value === 0) return `unchanged at 0 ${unit}`;
  return `${value > 0 ? "up" : "down"} ${Math.abs(value)} ${unit}`;
}

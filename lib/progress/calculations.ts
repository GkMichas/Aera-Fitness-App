import type { WeeklyReviewInput, WeeklyReviewResult } from "@/types/progress";

export function round(value: number, digits = 1) { return Number(value.toFixed(digits)); }

export function calculateChange(start?: number, end?: number) {
  return start === undefined || end === undefined ? undefined : round(end - start);
}

export function calculateAdherence(completed: number, planned: number) {
  if (!Number.isFinite(completed) || !Number.isFinite(planned) || completed < 0 || planned < 0) throw new Error("Adherence inputs must be non-negative finite numbers");
  if (planned === 0) return undefined;
  return Math.min(100, round(completed / planned * 100, 0));
}

export function calculateNutritionAdherence(actualCalories: number[], target?: number) {
  if (!target || target <= 0 || actualCalories.length === 0) return undefined;
  const valid = actualCalories.filter((value) => Number.isFinite(value) && value >= 0);
  if (!valid.length) return undefined;
  const averageScore = valid.reduce((sum, value) => sum + Math.max(0, 1 - Math.abs(value - target) / target), 0) / valid.length;
  return round(averageScore * 100, 0);
}

export function average(values: number[]) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, 0) : undefined;
}

export function estimatedOneRepMax(loadKg: number, reps: number) {
  if (loadKg < 0 || reps < 1 || reps > 30) throw new Error("Use a non-negative load and 1–30 reps");
  return round(loadKg * (1 + reps / 30));
}

export function linearTrend(values: number[]) {
  if (values.length < 2) return undefined;
  const xMean = (values.length - 1) / 2;
  const yMean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const numerator = values.reduce((sum, value, index) => sum + (index - xMean) * (value - yMean), 0);
  const denominator = values.reduce((sum, _value, index) => sum + (index - xMean) ** 2, 0);
  return round(numerator / denominator, 3);
}

export function generateWeeklyReview(input: WeeklyReviewInput): WeeklyReviewResult {
  const weightChangeKg = calculateChange(input.startMeasurement?.weightKg, input.endMeasurement?.weightKg);
  const waistChangeCm = calculateChange(input.startMeasurement?.waistCm, input.endMeasurement?.waistCm);
  const trainingAdherencePercent = calculateAdherence(input.completedWorkouts, input.plannedWorkouts);
  const nutritionAdherencePercent = calculateNutritionAdherence(input.dailyCalories, input.calorieTarget);
  const averageSleepMinutes = average(input.sleepMinutes);
  const evidence: string[] = [];
  if (weightChangeKg !== undefined) evidence.push(`Weight changed ${signed(weightChangeKg)} kg from the first to last recorded measurement.`);
  if (waistChangeCm !== undefined) evidence.push(`Waist changed ${signed(waistChangeCm)} cm from the first to last recorded measurement.`);
  if (trainingAdherencePercent !== undefined) evidence.push(`${input.completedWorkouts} of ${input.plannedWorkouts} planned workouts were completed (${trainingAdherencePercent}%).`);
  if (nutritionAdherencePercent !== undefined) evidence.push(`Average calorie-target adherence was ${nutritionAdherencePercent}% across ${input.dailyCalories.length} logged days.`);
  if (averageSleepMinutes !== undefined) evidence.push(`Average logged sleep was ${formatMinutes(averageSleepMinutes)}.`);

  const consistent = (trainingAdherencePercent ?? 0) >= 80 && (nutritionAdherencePercent ?? 0) >= 80;
  const lowSleep = averageSleepMinutes !== undefined && averageSleepMinutes < 420;
  const bodyStable = weightChangeKg !== undefined && Math.abs(weightChangeKg) <= 0.5;
  const waistImproving = waistChangeCm !== undefined && waistChangeCm < 0;
  const strengthStable = input.strengthChangePercent === undefined || input.strengthChangePercent >= -2;

  const title = consistent ? "A consistent week." : "A week to learn from.";
  const insight = consistent
    ? `${bodyStable ? "Body weight stayed within a narrow range" : "Your recorded body trend moved this week"}${waistImproving ? " while waist moved down" : ""}. Training and nutrition consistency were both above 80%.`
    : "The available records show a consistency gap, so one week is not enough evidence for a major plan change.";
  const recommendation = lowSleep
    ? "Keep the current plan and prioritise 20–30 more minutes of sleep before changing training or calories."
    : consistent && strengthStable
      ? "Keep the current plan for another week and continue collecting consistent measurements."
      : "Focus on completing the next planned sessions and logging meals consistently before adjusting the plan.";

  return { weekStart: input.weekStart, weekEnd: input.weekEnd, weightChangeKg, waistChangeCm, trainingAdherencePercent, nutritionAdherencePercent, averageSleepMinutes, title, insight, recommendation, evidence, rulesVersion: "aera-progress-v1" };
}

export function formatMinutes(minutes: number) { return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`; }
function signed(value: number) { return `${value > 0 ? "+" : ""}${value}`; }

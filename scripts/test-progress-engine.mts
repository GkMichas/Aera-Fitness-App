import assert from "node:assert/strict";
import { calculateAdherence, calculateNutritionAdherence, estimatedOneRepMax, generateWeeklyReview, linearTrend } from "../lib/progress/calculations.ts";

assert.equal(calculateAdherence(4, 4), 100);
assert.equal(calculateAdherence(3, 4), 75);
assert.equal(calculateAdherence(0, 0), undefined);
assert.throws(() => calculateAdherence(-1, 4));

assert.equal(calculateNutritionAdherence([2240, 2240], 2240), 100);
assert.equal(calculateNutritionAdherence([], 2240), undefined);
assert.equal(estimatedOneRepMax(25, 8), 31.7);
assert.throws(() => estimatedOneRepMax(25, 31));
assert.ok((linearTrend([84.3, 84.2, 84.1]) ?? 0) < 0);

const review = generateWeeklyReview({
  weekStart: "2026-08-12", weekEnd: "2026-08-18",
  startMeasurement: { date: "2026-08-11", weightKg: 84.1, waistCm: 84.9 },
  endMeasurement: { date: "2026-08-18", weightKg: 84.2, waistCm: 84.6 },
  completedWorkouts: 4, plannedWorkouts: 4,
  dailyCalories: [2180, 2260, 2215, 2300, 2160, 2245, 2200], calorieTarget: 2240,
  sleepMinutes: [405, 420, 390, 430, 410, 415, 400], strengthChangePercent: 1.8,
});
assert.equal(review.rulesVersion, "aera-progress-v1");
assert.equal(review.weightChangeKg, 0.1);
assert.equal(review.waistChangeCm, -0.3);
assert.equal(review.trainingAdherencePercent, 100);
assert.equal(review.nutritionAdherencePercent, 98);
assert.equal(review.averageSleepMinutes, 410);
assert.match(review.recommendation, /sleep/);
assert.equal(review.evidence.length, 5);

const missing = generateWeeklyReview({ weekStart: "2026-08-12", weekEnd: "2026-08-18", completedWorkouts: 0, plannedWorkouts: 0, dailyCalories: [], sleepMinutes: [] });
assert.equal(missing.weightChangeKg, undefined);
assert.equal(missing.trainingAdherencePercent, undefined);
assert.match(missing.insight, /consistency gap/);

console.log("Progress trends, adherence and weekly-review rules tests passed.");

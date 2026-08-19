import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { programmingEngine } from "../lib/training/programming-engine.ts";
import type { TrainingCatalog } from "../types/training.ts";

const catalog = JSON.parse(await readFile(new URL("../data/training/catalog.v1.json", import.meta.url), "utf8")) as TrainingCatalog;
const base = { goal: "muscle_gain", experience: "intermediate", daysPerWeek: 4, sessionDurationMinutes: 45, equipmentIds: ["bodyweight", "mat", "dumbbells", "bench", "resistance-band"] } as const;

const first = programmingEngine.generate(base, catalog);
const second = programmingEngine.generate(base, catalog);
assert.deepEqual(first, second, "same input must produce the same plan");
assert.equal(first.rulesVersion, "aera-programming-v1");
assert.equal(first.workouts.length, 4);
assert.deepEqual(first.workouts.map((workout) => workout.focus), ["upper", "lower", "upper", "lower"]);
assert.ok(first.workouts.every((workout) => workout.exercises.length <= 5));

const allowed = new Set(base.equipmentIds);
for (const workout of first.workouts) for (const item of workout.exercises) {
  const exercise = catalog.exercises.find((candidate) => candidate.id === item.exerciseId);
  assert.ok(exercise, `exercise ${item.exerciseId} must exist in the curated catalog`);
  assert.ok(exercise.equipmentIds.every((id) => allowed.has(id)), `${exercise.name} must respect equipment availability`);
  assert.equal(item.targetRir, 2);
}

const progressed = programmingEngine.generate({ ...base, recentPerformance: [{ exerciseId: "ex_dumbbell_row", prescribedSets: 3, completedSets: 3, prescribedReps: 10, completedReps: 10, actualRir: 3, loadKg: 20 }] }, catalog);
const rowProgression = progressed.progression.find((item) => item.exerciseId === "ex_dumbbell_row");
assert.equal(rowProgression?.action, "increase");
assert.equal(rowProgression?.nextLoadKg, 21);

const pain = programmingEngine.generate({ ...base, recentPerformance: [{ exerciseId: "ex_dumbbell_row", prescribedSets: 3, completedSets: 3, actualRir: 2, loadKg: 20, painReported: true }] }, catalog);
assert.equal(pain.progression.find((item) => item.exerciseId === "ex_dumbbell_row")?.action, "substitute");
assert.ok(pain.workouts.every((workout) => workout.exercises.every((item) => item.exerciseId !== "ex_dumbbell_row")), "pain-reported exercise must be removed from generated workouts");

const cautious = programmingEngine.generate({ ...base, excludedCautionTags: ["knee-load"] }, catalog);
for (const workout of cautious.workouts) for (const item of workout.exercises) {
  const exercise = catalog.exercises.find((candidate) => candidate.id === item.exerciseId)!;
  assert.ok(!exercise.cautionTags.includes("knee-load"), "excluded caution tags must be respected");
}

console.log(`Training engine tests passed: ${first.workouts.length} workouts, deterministic selection, equipment filtering, progression and pain substitution.`);

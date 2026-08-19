import type { Exercise, TrainingCatalog, WorkoutExercise } from "@/types/training";
import type { GeneratedTrainingPlan, ProgrammingInput, ProgressionDecision, ProgrammedWorkout, WorkoutFocus } from "@/types/programming";

const splitByDays: Record<number, WorkoutFocus[]> = {
  1: ["full_body"], 2: ["full_body", "full_body"], 3: ["upper", "lower", "full_body"],
  4: ["upper", "lower", "upper", "lower"], 5: ["upper", "lower", "push", "pull", "full_body"],
  6: ["push", "pull", "lower", "push", "pull", "lower"],
};

const focusMuscles: Record<WorkoutFocus, string[]> = {
  full_body: ["quadriceps", "glutes", "back", "chest", "shoulders", "core"],
  upper: ["chest", "back", "shoulders", "triceps", "biceps", "core"],
  lower: ["quadriceps", "glutes", "hamstrings", "calves", "core"],
  push: ["chest", "shoulders", "triceps", "core"],
  pull: ["back", "biceps", "shoulders", "core"],
};

const focusNames: Record<WorkoutFocus, string> = { full_body: "Full Body", upper: "Upper Body", lower: "Lower Body", push: "Push", pull: "Pull" };
const durationExerciseCount = { 15: 3, 30: 4, 45: 5, 60: 6 } as const;
const difficultyRank = { beginner: 0, intermediate: 1, advanced: 2 } as const;
const compoundPatterns = new Set(["horizontal-push", "horizontal-pull", "vertical-push", "squat", "hinge", "lunge"]);

export const programmingEngine = {
  generate(input: ProgrammingInput, catalog: TrainingCatalog): GeneratedTrainingPlan {
    validateInput(input);
    const eligible = getEligibleExercises(input, catalog);
    const warnings: string[] = [];
    const focuses = splitByDays[input.daysPerWeek];
    const recent = new Map((input.recentPerformance ?? []).map((item) => [item.exerciseId, item]));
    const progression = eligible.map((exercise) => decideProgression(exercise, recent.get(exercise.id), input));
    const progressionByExercise = new Map(progression.map((item) => [item.exerciseId, item]));
    const selectable = eligible.filter((exercise) => progressionByExercise.get(exercise.id)?.action !== "substitute");
    if (selectable.length < durationExerciseCount[input.sessionDurationMinutes]) warnings.push("Available curated exercises are limited by equipment, experience, caution exclusions or pain substitutions.");
    if (progression.some((item) => item.action === "substitute")) warnings.push("At least one exercise was removed because pain was reported. This is a training adjustment, not a diagnosis.");
    const usage = new Map<string, number>();
    const workouts = focuses.map((focus, index) => programWorkout(focus, index + 1, input, selectable, usage, progressionByExercise));
    return {
      rulesVersion: "aera-programming-v1", input, workouts, progression,
      rationale: [
        `${input.daysPerWeek}-day ${focuses.map((focus) => focusNames[focus]).join(" / ")} split selected for ${goalLabel(input.goal)}.`,
        `${input.sessionDurationMinutes}-minute sessions use up to ${durationExerciseCount[input.sessionDurationMinutes]} curated exercises.`,
        `Volume and intensity are prescribed for ${input.experience} experience with progression owned by deterministic performance rules.`,
      ], warnings,
    };
  },
};

function validateInput(input: ProgrammingInput) {
  if (!splitByDays[input.daysPerWeek]) throw new Error("daysPerWeek must be between 1 and 6");
  if (!durationExerciseCount[input.sessionDurationMinutes]) throw new Error("Unsupported session duration");
  if (!input.equipmentIds.length) throw new Error("At least one equipment ID is required");
}

function getEligibleExercises(input: ProgrammingInput, catalog: TrainingCatalog) {
  const available = new Set(input.equipmentIds);
  const excluded = new Set(input.excludedCautionTags ?? []);
  return catalog.exercises.filter((exercise) => exercise.equipmentIds.every((id) => available.has(id))
    && difficultyRank[exercise.difficulty] <= difficultyRank[input.experience]
    && !exercise.cautionTags.some((tag) => excluded.has(tag)));
}

function programWorkout(focus: WorkoutFocus, day: number, input: ProgrammingInput, eligible: Exercise[], usage: Map<string, number>, progression: Map<string, ProgressionDecision>): ProgrammedWorkout {
  const targetCount = durationExerciseCount[input.sessionDurationMinutes];
  const desired = focusMuscles[focus];
  const scored = eligible.map((exercise) => ({ exercise, score: scoreExercise(exercise, desired, usage) }))
    .sort((a, b) => b.score - a.score || a.exercise.id.localeCompare(b.exercise.id));
  const selected: Exercise[] = [];
  const patterns = new Set<string>();
  for (const item of scored) {
    if (selected.length >= targetCount) break;
    const addsPattern = !patterns.has(item.exercise.movementPatternId);
    if (addsPattern || selected.length >= Math.ceil(targetCount / 2)) {
      selected.push(item.exercise); patterns.add(item.exercise.movementPatternId);
    }
  }
  for (const exercise of selected) usage.set(exercise.id, (usage.get(exercise.id) ?? 0) + 1);
  const exercises = selected.map((exercise, index) => prescribeExercise(exercise, index + 1, input, progression.get(exercise.id)));
  const targetMuscleIds = [...new Set(selected.flatMap((exercise) => exercise.primaryMuscleIds))];
  const equipmentIds = [...new Set(selected.flatMap((exercise) => exercise.equipmentIds))];
  return { id: `generated_day_${day}`, day, focus, name: `${focusNames[focus]} ${day}`, difficulty: input.experience, durationMinutes: input.sessionDurationMinutes, targetMuscleIds, equipmentIds, exercises };
}

function scoreExercise(exercise: Exercise, desired: string[], usage: Map<string, number>) {
  const primaryMatches = exercise.primaryMuscleIds.filter((id) => desired.includes(id)).length;
  const secondaryMatches = exercise.secondaryMuscleIds.filter((id) => desired.includes(id)).length;
  const compoundBonus = compoundPatterns.has(exercise.movementPatternId) ? 3 : 0;
  return primaryMatches * 8 + secondaryMatches * 2 + compoundBonus - (usage.get(exercise.id) ?? 0) * 4;
}

function prescribeExercise(exercise: Exercise, order: number, input: ProgrammingInput, decision?: ProgressionDecision): WorkoutExercise {
  const compound = compoundPatterns.has(exercise.movementPatternId);
  const timed = exercise.movementPatternId.startsWith("anti-");
  const prescription = prescriptionFor(input, compound, timed);
  return { exerciseId: exercise.id, order, ...prescription, ...(decision?.nextLoadKg !== undefined ? { loadKg: decision.nextLoadKg } : {}) };
}

function prescriptionFor(input: ProgrammingInput, compound: boolean, timed: boolean): Omit<WorkoutExercise, "exerciseId" | "order" | "loadKg"> {
  if (timed) return { sets: input.experience === "beginner" ? 2 : 3, durationSeconds: input.experience === "advanced" ? 60 : 45, restSeconds: 45, targetRir: 2 };
  if (input.goal === "strength" && compound) return { sets: input.experience === "beginner" ? 3 : 4, reps: input.experience === "advanced" ? 5 : 6, restSeconds: 120, targetRir: 2 };
  if (input.goal === "muscle_gain") return { sets: compound ? (input.experience === "beginner" ? 3 : 4) : 3, reps: compound ? 10 : 12, restSeconds: compound ? 90 : 60, targetRir: 2 };
  if (input.goal === "fat_loss" || input.goal === "general_fitness") return { sets: compound ? 3 : 2, reps: compound ? 10 : 15, restSeconds: compound ? 60 : 45, targetRir: 2 };
  return { sets: compound ? 3 : 2, reps: compound ? 10 : 12, restSeconds: compound ? 75 : 60, targetRir: 2 };
}

function decideProgression(exercise: Exercise, recent: ProgrammingInput["recentPerformance"] extends (infer T)[] | undefined ? T | undefined : never, input: ProgrammingInput): ProgressionDecision {
  if (!recent || recent.loadKg === undefined) return { exerciseId: exercise.id, action: "unloaded", reason: "No prior load is available; establish a controlled baseline." };
  if (recent.painReported) return { exerciseId: exercise.id, action: "substitute", previousLoadKg: recent.loadKg, reason: "Pain was reported; do not progress load and select a curated alternative or regression." };
  const completion = recent.prescribedSets > 0 ? recent.completedSets / recent.prescribedSets : 0;
  const hitTopReps = recent.prescribedReps === undefined || (recent.completedReps ?? 0) >= recent.prescribedReps;
  if (completion === 1 && hitTopReps && (recent.actualRir ?? 0) >= 3) {
    const rate = input.experience === "advanced" ? 0.025 : 0.05;
    return { exerciseId: exercise.id, action: "increase", previousLoadKg: recent.loadKg, nextLoadKg: roundLoad(recent.loadKg * (1 + rate)), reason: "All work was completed at the top target with at least 3 RIR." };
  }
  if (completion < 0.75 || (recent.actualRir !== undefined && recent.actualRir === 0)) {
    return { exerciseId: exercise.id, action: "reduce", previousLoadKg: recent.loadKg, nextLoadKg: roundLoad(recent.loadKg * 0.95), reason: "Completion was below 75% or the final set reached 0 RIR." };
  }
  return { exerciseId: exercise.id, action: "maintain", previousLoadKg: recent.loadKg, nextLoadKg: recent.loadKg, reason: "Keep load stable until all prescribed work is completed with target RIR." };
}

function roundLoad(value: number) { return Math.max(0, Math.round(value * 2) / 2); }
function goalLabel(goal: ProgrammingInput["goal"]) { return goal.replaceAll("_", " "); }

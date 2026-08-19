import type { ExerciseDifficulty, TrainingCatalog, Workout } from "@/types/training";

export type TrainingGoal = "fat_loss" | "muscle_gain" | "strength" | "general_fitness" | "maintenance";
export type TrainingExperience = ExerciseDifficulty;
export type WorkoutFocus = "full_body" | "upper" | "lower" | "push" | "pull";

export interface RecentExercisePerformance {
  exerciseId: string;
  prescribedSets: number;
  completedSets: number;
  prescribedReps?: number;
  completedReps?: number;
  actualRir?: number;
  loadKg?: number;
  painReported?: boolean;
}

export interface ProgrammingInput {
  goal: TrainingGoal;
  experience: TrainingExperience;
  daysPerWeek: 1 | 2 | 3 | 4 | 5 | 6;
  sessionDurationMinutes: 15 | 30 | 45 | 60;
  equipmentIds: string[];
  excludedCautionTags?: string[];
  recentPerformance?: RecentExercisePerformance[];
}

export interface ProgressionDecision {
  exerciseId: string;
  action: "increase" | "maintain" | "reduce" | "substitute" | "unloaded";
  previousLoadKg?: number;
  nextLoadKg?: number;
  reason: string;
}

export interface ProgrammedWorkout extends Workout {
  day: number;
  focus: WorkoutFocus;
}

export interface GeneratedTrainingPlan {
  rulesVersion: "aera-programming-v1";
  input: ProgrammingInput;
  workouts: ProgrammedWorkout[];
  progression: ProgressionDecision[];
  rationale: string[];
  warnings: string[];
}

export interface ProgrammingEngine {
  generate(input: ProgrammingInput, catalog: TrainingCatalog): GeneratedTrainingPlan;
}

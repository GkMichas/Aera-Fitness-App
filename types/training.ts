export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced";
export type ExerciseRelationKind = "alternative" | "regression" | "progression";
export type WorkoutStatus = "draft" | "scheduled" | "active" | "completed" | "skipped";
export type SetStatus = "pending" | "completed" | "skipped";

export interface Equipment {
  id: string;
  name: string;
  category: "bodyweight" | "free_weight" | "resistance" | "station" | "accessory";
}

export interface Muscle {
  id: string;
  name: string;
  region: "upper" | "lower" | "core" | "full_body";
}

export interface MovementPattern {
  id: string;
  name: string;
  description: string;
}

export interface ExerciseRelation {
  exerciseId: string;
  kind: ExerciseRelationKind;
}

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  summary: string;
  difficulty: ExerciseDifficulty;
  movementPatternId: string;
  equipmentIds: string[];
  primaryMuscleIds: string[];
  secondaryMuscleIds: string[];
  mediaId: string;
  instructions: string[];
  coachingCues: string[];
  cautionTags: string[];
  relations: ExerciseRelation[];
}

export interface TrainingCatalog {
  schemaVersion: 1;
  equipment: Equipment[];
  muscles: Muscle[];
  movementPatterns: MovementPattern[];
  exercises: Exercise[];
}

export interface HomeGymEquipment {
  sourceId: string;
  category: string;
  name: string;
  primaryUse: string;
  type: string;
  spaceRequirement: string;
  costTier: string;
  userLevel: string;
  coverage: string;
}

export interface HomeGymExercise {
  sourceIds: string[];
  name: string;
  equipmentIds: string[];
  equipmentCategories: string[];
  movementPatterns: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  difficultyLabels: string[];
  unilateral: boolean;
  additionalEquipment: string[];
  notes: string[];
}

export interface HomeGymDatabase {
  schemaVersion: 2;
  source: { workbook: string; sheets: string[]; language: string };
  stats: { equipmentItems: number; exerciseEquipmentLinks: number; uniqueExercises: number };
  equipment: HomeGymEquipment[];
  exercises: HomeGymExercise[];
}

export interface ExerciseLibraryEntry {
  id: string;
  href: string;
  name: string;
  summary: string;
  difficulty: string;
  movementPatterns: string[];
  equipmentNames: string[];
  muscleNames: string[];
  mediaId?: string;
  curated: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  order: number;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  targetRir?: number;
  loadKg?: number;
}

export interface Workout {
  id: string;
  name: string;
  difficulty: ExerciseDifficulty;
  durationMinutes: number;
  targetMuscleIds: string[];
  equipmentIds: string[];
  exercises: WorkoutExercise[];
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  userId: string;
  status: WorkoutStatus;
  startedAt?: string;
  completedAt?: string;
  perceivedEffort?: 1 | 2 | 3 | 4 | 5;
}

export interface ExerciseSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  status: SetStatus;
  reps?: number;
  durationSeconds?: number;
  loadKg?: number;
  rir?: number;
}

export interface PainEvent {
  id: string;
  sessionId: string;
  userId: string;
  bodyArea: string;
  severity: number;
  description?: string;
}

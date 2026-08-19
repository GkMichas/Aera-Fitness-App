import type { Exercise, ExerciseSet, PainEvent, Workout, WorkoutSession } from "@/types/training";

export interface ExerciseFilters {
  query?: string;
  muscleId?: string;
  equipmentId?: string;
  difficulty?: Exercise["difficulty"];
  movementPatternId?: string;
}

export interface TrainingRepository {
  listExercises(filters?: ExerciseFilters): Promise<Exercise[]>;
  getExercise(idOrSlug: string): Promise<Exercise | null>;
  getWorkout(id: string): Promise<Workout | null>;
  createSession(workoutId: string): Promise<WorkoutSession>;
  recordSet(set: ExerciseSet): Promise<void>;
  recordPainEvent(event: PainEvent): Promise<void>;
}

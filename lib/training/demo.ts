import type { Workout } from "@/types/training";

export const demoWorkout: Workout = {
  id: "workout_upper_body_a",
  name: "Upper Body",
  difficulty: "intermediate",
  durationMinutes: 45,
  targetMuscleIds: ["chest", "shoulders", "back", "triceps", "biceps"],
  equipmentIds: ["dumbbells", "bench", "bodyweight", "mat"],
  exercises: [
    { exerciseId: "ex_push_up", order: 1, sets: 3, reps: 12, restSeconds: 60, targetRir: 2 },
    { exerciseId: "ex_dumbbell_row", order: 2, sets: 3, reps: 10, restSeconds: 75, targetRir: 2, loadKg: 16 },
    { exerciseId: "ex_shoulder_press", order: 3, sets: 3, reps: 10, restSeconds: 75, targetRir: 2 },
    { exerciseId: "ex_biceps_curl", order: 4, sets: 2, reps: 12, restSeconds: 60, targetRir: 2 },
    { exerciseId: "ex_plank", order: 5, sets: 3, durationSeconds: 45, restSeconds: 45 }
  ]
};

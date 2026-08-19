import catalogJson from "@/data/training/catalog.v1.json";
import type { Exercise, TrainingCatalog } from "@/types/training";

export const trainingCatalog = catalogJson as TrainingCatalog;

const exercisesById = new Map(trainingCatalog.exercises.map((exercise) => [exercise.id, exercise]));
const musclesById = new Map(trainingCatalog.muscles.map((muscle) => [muscle.id, muscle]));
const equipmentById = new Map(trainingCatalog.equipment.map((item) => [item.id, item]));
const patternsById = new Map(trainingCatalog.movementPatterns.map((pattern) => [pattern.id, pattern]));

export function getExercise(idOrSlug: string): Exercise | undefined {
  return exercisesById.get(idOrSlug) ?? trainingCatalog.exercises.find((exercise) => exercise.slug === idOrSlug);
}

export function getMuscleName(id: string) {
  return musclesById.get(id)?.name ?? id;
}

export function getEquipmentName(id: string) {
  return equipmentById.get(id)?.name ?? id;
}

export function getMovementPatternName(id: string) {
  return patternsById.get(id)?.name ?? id;
}

export function getRelatedExercises(exercise: Exercise) {
  return exercise.relations.flatMap((relation) => {
    const related = exercisesById.get(relation.exerciseId);
    return related ? [{ ...relation, exercise: related }] : [];
  });
}

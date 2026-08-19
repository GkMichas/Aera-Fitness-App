import databaseJson from "@/data/training/home-gym-database.v1.json";
import { getEquipmentName, getMovementPatternName, getMuscleName, trainingCatalog } from "@/lib/training/catalog";
import type { ExerciseLibraryEntry, HomeGymDatabase } from "@/types/training";

export const homeGymDatabase = databaseJson as HomeGymDatabase;
const sourceEquipment = new Map(homeGymDatabase.equipment.map((item) => [item.sourceId, item]));
const sourceExercises = new Map(homeGymDatabase.exercises.flatMap((exercise) => exercise.sourceIds.map((id) => [id, exercise] as const)));

export function getHomeGymEquipment(id: string) { return sourceEquipment.get(id); }
export function getHomeGymExercise(sourceId: string) { return sourceExercises.get(sourceId); }

export function getExerciseLibraryEntries(): ExerciseLibraryEntry[] {
  const curatedNames = new Set(trainingCatalog.exercises.map((exercise) => exercise.name.toLowerCase()));
  const curated: ExerciseLibraryEntry[] = trainingCatalog.exercises.map((exercise) => ({
    id: exercise.id, href: `/training/exercise/${exercise.slug}`, name: exercise.name, summary: exercise.summary,
    difficulty: titleCase(exercise.difficulty), movementPatterns: [getMovementPatternName(exercise.movementPatternId)],
    equipmentNames: exercise.equipmentIds.map(getEquipmentName),
    muscleNames: [...exercise.primaryMuscleIds, ...exercise.secondaryMuscleIds].map(getMuscleName),
    mediaId: exercise.mediaId, curated: true,
  }));
  const imported: ExerciseLibraryEntry[] = homeGymDatabase.exercises
    .filter((exercise) => !curatedNames.has(exercise.name.toLowerCase()))
    .map((exercise) => ({
      id: exercise.sourceIds[0], href: `/training/exercises/database/${exercise.sourceIds[0]}`, name: exercise.name,
      summary: `${exercise.movementPatterns.join(" · ")} · ${exercise.equipmentCategories.join(", ")}`,
      difficulty: exercise.difficultyLabels.join(" / ") || "Not specified", movementPatterns: exercise.movementPatterns,
      equipmentNames: exercise.equipmentIds.map((id) => sourceEquipment.get(id)?.name ?? id),
      muscleNames: [...exercise.primaryMuscles, ...exercise.secondaryMuscles], curated: false,
    }));
  return [...curated, ...imported].sort((a, b) => Number(b.curated) - Number(a.curated) || a.name.localeCompare(b.name));
}

function titleCase(value: string) { return `${value.charAt(0).toUpperCase()}${value.slice(1)}`; }

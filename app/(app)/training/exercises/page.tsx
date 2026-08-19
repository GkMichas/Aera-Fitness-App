import { ExerciseLibrary } from "@/components/exercise-library";
import { getExerciseLibraryEntries, homeGymDatabase } from "@/lib/training/home-gym-catalog";

export default function ExercisesPage() {
  return <ExerciseLibrary entries={getExerciseLibraryEntries()} stats={homeGymDatabase.stats} />;
}

import { notFound } from "next/navigation";
import { DatabaseExerciseDetail } from "@/components/database-exercise-detail";
import { getHomeGymExercise } from "@/lib/training/home-gym-catalog";

export default async function DatabaseExercisePage({ params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params;
  const exercise = getHomeGymExercise(sourceId);
  if (!exercise) notFound();
  return <DatabaseExerciseDetail exercise={exercise} />;
}

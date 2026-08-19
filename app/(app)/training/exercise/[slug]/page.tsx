import { notFound } from "next/navigation";
import { ExerciseDetail } from "@/components/exercise-detail";
import { getExercise, trainingCatalog } from "@/lib/training/catalog";

export function generateStaticParams() {
  return trainingCatalog.exercises.map((exercise) => ({ slug: exercise.slug }));
}

export default async function ExerciseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exercise = getExercise(slug);
  if (!exercise) notFound();
  return <ExerciseDetail exercise={exercise} />;
}

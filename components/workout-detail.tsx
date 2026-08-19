import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { demoWorkout } from "@/lib/training/demo";
import { getEquipmentName, getExercise, getMuscleName } from "@/lib/training/catalog";
import { getMediaAsset } from "@/lib/media/catalog";

export function WorkoutDetail() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between"><Link href="/training" aria-label="Back to training" className="grid size-11 place-items-center rounded-lg border border-black/10 bg-white"><ArrowLeft size={20} /></Link><button type="button" className="text-sm font-bold text-[var(--aera-terracotta)]">Alternatives</button></div>
      <header><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-forest)]">Training · Today</p><h1 className="mt-2 text-[36px] font-bold leading-none tracking-[-.035em] sm:text-[48px]">{demoWorkout.name}</h1></header>
      <section className="grid grid-cols-3 overflow-hidden rounded-xl border border-black/10 bg-black/10 gap-px">
        <Metric label="Duration" value={`${demoWorkout.durationMinutes} min`} /><Metric label="Exercises" value={String(demoWorkout.exercises.length)} /><Metric label="Level" value="Moderate" />
      </section>
      <p className="text-sm text-black/55">{demoWorkout.targetMuscleIds.map(getMuscleName).join(", ")} · {demoWorkout.equipmentIds.map(getEquipmentName).join(", ")}</p>
      <section className="overflow-hidden rounded-xl border border-black/10 bg-black/10">
        <div className="space-y-px">
          {demoWorkout.exercises.map((item) => {
            const exercise = getExercise(item.exerciseId);
            if (!exercise) return null;
            const media = getMediaAsset(exercise.mediaId);
            const prescription = item.reps ? `${item.sets} × ${item.reps}` : `${item.sets} × ${item.durationSeconds}s`;
            return <Link key={item.exerciseId} href={`/training/exercise/${exercise.slug}`} className="flex items-center gap-3 bg-white p-3 transition hover:bg-[var(--aera-ivory)]"><div className="relative size-15 shrink-0 overflow-hidden rounded-lg bg-[var(--aera-stone)]">{media && <Image src={media.src} alt="" fill className="object-cover" sizes="60px" />}</div><div className="min-w-0 flex-1"><h2 className="font-semibold">{exercise.name}</h2><p className="mt-1 truncate text-xs text-black/50">{prescription} · {exercise.primaryMuscleIds.map(getMuscleName).join(", ")}</p></div><ChevronRight size={19} className="text-black/30" /></Link>;
          })}
        </div>
      </section>
      <Link href="/training/active" className="flex min-h-14 w-full items-center justify-center rounded-lg bg-[var(--aera-terracotta)] px-6 text-base font-bold text-white">Start Workout</Link>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="bg-white p-4"><p className="text-[9px] font-bold uppercase tracking-[.1em] text-black/45">{label}</p><p className="mt-1 text-base font-bold sm:text-lg">{value}</p></div>; }

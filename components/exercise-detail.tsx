import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play } from "lucide-react";
import { getEquipmentName, getMuscleName, getMovementPatternName, getRelatedExercises } from "@/lib/training/catalog";
import { getMediaAsset } from "@/lib/media/catalog";
import type { Exercise } from "@/types/training";

export function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const related = getRelatedExercises(exercise);
  const media = getMediaAsset(exercise.mediaId);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/training/exercises" aria-label="Back to exercise library" className="grid size-11 place-items-center rounded-lg border border-black/10 bg-white"><ArrowLeft size={20} /></Link>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.95fr)]">
        <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-[var(--aera-stone)] lg:min-h-[590px]">
          {media && <Image src={media.src} alt={media.alt} fill className="object-cover object-center" sizes="(max-width: 1023px) 100vw, 520px" priority />}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-5 pt-20 text-white"><div><p className="text-sm font-semibold">{exercise.coachingCues.join(" · ")}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.12em] text-white/65">{exercise.mediaId}</p></div><span className="flex items-center gap-2 text-xs font-bold"><Play size={15} fill="currentColor" /> Poster preview</span></div>
        </div>
        <div className="space-y-6">
          <header><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[var(--aera-forest)]">{exercise.primaryMuscleIds.map(getMuscleName).join(" · ")} · {exercise.difficulty}</p><h1 className="mt-2 text-[34px] font-bold leading-[1.05] tracking-[-.035em] sm:text-[44px]">{exercise.name}</h1><p className="mt-3 text-[15px] leading-6 text-black/55">{exercise.summary}</p></header>
          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-black/10 bg-black/10 gap-px">
            <Meta label="Movement" value={getMovementPatternName(exercise.movementPatternId)} />
            <Meta label="Equipment" value={exercise.equipmentIds.map(getEquipmentName).join(", ")} />
            <Meta label="Secondary" value={exercise.secondaryMuscleIds.map(getMuscleName).join(", ") || "—"} />
          </div>
          <section className="rounded-xl border border-black/10 bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[.12em] text-black/45">How to do it</p><ol className="mt-4 space-y-3">{exercise.instructions.map((instruction, index) => <li key={instruction} className="flex gap-3 text-[15px] leading-6 text-black/75"><span className="font-bold text-[var(--aera-terracotta)]">{index + 1}</span><span>{instruction}</span></li>)}</ol></section>
          {exercise.cautionTags.length > 0 && <section className="rounded-xl border border-[color-mix(in_srgb,var(--aera-warning)_25%,transparent)] bg-[color-mix(in_srgb,var(--aera-warning)_8%,white)] p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--aera-warning)]">Caution tags</p><p className="mt-2 text-sm leading-5 text-black/65">{exercise.cautionTags.join(" · ")}. These tags guide exercise selection and are not a diagnosis.</p></section>}
          {related.length > 0 && <section><p className="mb-3 text-[11px] font-bold uppercase tracking-[.12em] text-black/45">Related exercises</p><div className="flex flex-wrap gap-2">{related.map(({ kind, exercise: item }) => <Link key={`${kind}-${item.id}`} href={`/training/exercise/${item.slug}`} className="rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm font-semibold">{item.name}</Link>)}</div></section>}
          <Link href="/training/workout" className="flex min-h-13 w-full items-center justify-center rounded-lg bg-[var(--aera-terracotta)] px-5 font-bold text-white">Back to workout</Link>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) { return <div className="min-w-0 bg-white p-3"><p className="text-[9px] font-bold uppercase tracking-[.09em] text-black/40">{label}</p><p className="mt-1 break-words text-xs font-bold leading-4 sm:text-sm">{value}</p></div>; }

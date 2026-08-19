import Link from "next/link";
import { ArrowLeft, Database, ShieldCheck } from "lucide-react";
import { getHomeGymEquipment, homeGymDatabase } from "@/lib/training/home-gym-catalog";
import type { HomeGymExercise } from "@/types/training";

export function DatabaseExerciseDetail({ exercise }: { exercise: HomeGymExercise }) {
  const equipment = exercise.equipmentIds.flatMap((id) => { const item = getHomeGymEquipment(id); return item ? [item] : []; });
  return <div className="mx-auto max-w-4xl space-y-6">
    <Link href="/training/exercises" aria-label="Back to exercise library" className="grid size-11 place-items-center rounded-lg border border-black/10 bg-white"><ArrowLeft size={20} /></Link>
    <header className="rounded-2xl bg-[var(--aera-forest)] p-6 text-white sm:p-9"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-white/60"><Database size={15} /> Imported metadata · {homeGymDatabase.source.workbook}</div><h1 className="mt-5 text-[36px] font-bold leading-none tracking-[-.035em] sm:text-[50px]">{exercise.name}</h1><div className="mt-7 flex flex-wrap gap-2">{exercise.movementPatterns.map((item) => <Tag key={item}>{item}</Tag>)}{exercise.unilateral && <Tag>Unilateral</Tag>}</div></header>
    <div className="grid gap-5 md:grid-cols-2"><Panel title="Muscles"><Definition label="Primary" value={exercise.primaryMuscles.join(", ") || "—"} /><Definition label="Secondary" value={exercise.secondaryMuscles.join(", ") || "—"} /></Panel><Panel title="Training classification"><Definition label="Difficulty" value={exercise.difficultyLabels.join(" / ") || "—"} /><Definition label="Source IDs" value={exercise.sourceIds.join(", ")} /></Panel></div>
    <section className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"><h2 className="text-[11px] font-bold uppercase tracking-[.12em] text-black/45">Compatible equipment</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{equipment.map((item) => <div key={item.sourceId} className="rounded-lg bg-[var(--aera-ivory)] p-4"><div className="flex items-start justify-between gap-3"><p className="font-bold">{item.name}</p><span className="text-[10px] font-bold text-black/35">{item.sourceId}</span></div><p className="mt-3 text-xs leading-5 text-black/55">{item.category} · {item.spaceRequirement} space · {item.costTier}</p></div>)}</div></section>
    {(exercise.additionalEquipment.length > 0 || exercise.notes.length > 0) && <Panel title="Source notes"><Definition label="Additional equipment" value={exercise.additionalEquipment.join(", ") || "—"} /><Definition label="Notes" value={exercise.notes.join(" · ") || "—"} /></Panel>}
    <section className="flex gap-3 rounded-xl border border-[color-mix(in_srgb,var(--aera-warning)_25%,transparent)] bg-[color-mix(in_srgb,var(--aera-warning)_8%,white)] p-5"><ShieldCheck className="mt-0.5 shrink-0 text-[var(--aera-warning)]" size={20} /><div><h2 className="font-bold">Metadata-only exercise</h2><p className="mt-1 text-sm leading-6 text-black/60">This entry supports equipment compatibility, filtering and catalog planning. It will not be selected by the workout engine until instructions, media and safety tags complete AERA curation.</p></div></section>
  </div>;
}

function Tag({ children }: { children: React.ReactNode }) { return <span className="rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white/80">{children}</span>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-xl border border-black/10 bg-white p-5"><h2 className="text-[11px] font-bold uppercase tracking-[.12em] text-black/45">{title}</h2><div className="mt-4 space-y-4">{children}</div></section>; }
function Definition({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-[.1em] text-black/35">{label}</p><p className="mt-1 text-sm font-semibold leading-5">{value}</p></div>; }

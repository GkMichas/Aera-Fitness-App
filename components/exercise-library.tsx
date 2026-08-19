"use client";

import Link from "next/link";
import Image from "next/image";
import { Database, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { ExerciseLibraryEntry, HomeGymDatabase } from "@/types/training";
import { getMediaAsset } from "@/lib/media/catalog";

const all = "all";

export function ExerciseLibrary({ entries, stats }: { entries: ExerciseLibraryEntry[]; stats: HomeGymDatabase["stats"] }) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState(all);
  const [equipment, setEquipment] = useState(all);
  const [difficulty, setDifficulty] = useState(all);
  const [pattern, setPattern] = useState(all);
  const [source, setSource] = useState(all);
  const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const muscles = unique(entries.flatMap((item) => item.muscleNames));
  const equipmentNames = unique(entries.flatMap((item) => item.equipmentNames));
  const difficulties = unique(entries.map((item) => item.difficulty));
  const patterns = unique(entries.flatMap((item) => item.movementPatterns));
  const normalized = query.trim().toLowerCase();
  const results = entries.filter((exercise) => {
    const searchable = [exercise.name, exercise.summary, ...exercise.muscleNames, ...exercise.equipmentNames].join(" ").toLowerCase();
    return (!normalized || searchable.includes(normalized)) && (muscle === all || exercise.muscleNames.includes(muscle))
      && (equipment === all || exercise.equipmentNames.includes(equipment)) && (difficulty === all || exercise.difficulty === difficulty)
      && (pattern === all || exercise.movementPatterns.includes(pattern)) && (source === all || (source === "curated" ? exercise.curated : !exercise.curated));
  });
  const clear = () => { setQuery(""); setMuscle(all); setEquipment(all); setDifficulty(all); setPattern(all); setSource(all); };
  const hasFilters = query || [muscle, equipment, difficulty, pattern, source].some((item) => item !== all);

  return <div className="space-y-7">
    <header className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-forest)]">Training catalog · English source</p><h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">Exercise Library</h1><p className="mt-3 max-w-2xl text-[15px] leading-6 text-black/55">{stats.uniqueExercises} exercises · {stats.equipmentItems} equipment items · {stats.exerciseEquipmentLinks} verified exercise–equipment links.</p></div><Link href="/training" className="hidden text-sm font-semibold text-[var(--aera-terracotta)] sm:block">Back to training</Link></header>
    <section className="rounded-xl border border-black/10 bg-white p-4 sm:p-5" aria-label="Exercise filters"><label className="flex min-h-12 items-center gap-3 rounded-lg border border-black/15 bg-[var(--aera-ivory)] px-4"><Search size={18} aria-hidden="true" className="text-black/45" /><span className="sr-only">Search exercises</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exercises" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-black/40" /></label><div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1"><SlidersHorizontal size={17} className="mr-1 shrink-0 text-black/45" /><Filter label="Source" value={source} onChange={setSource} items={[{ id: "curated", name: "AERA curated" }, { id: "database", name: "Home Gym database" }]} /><Filter label="Muscle" value={muscle} onChange={setMuscle} items={muscles.map(valueItem)} /><Filter label="Equipment" value={equipment} onChange={setEquipment} items={equipmentNames.map(valueItem)} /><Filter label="Difficulty" value={difficulty} onChange={setDifficulty} items={difficulties.map(valueItem)} /><Filter label="Movement" value={pattern} onChange={setPattern} items={patterns.map(valueItem)} /></div></section>
    <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.12em] text-black/45">{results.length} results</p>{hasFilters && <button type="button" onClick={clear} className="text-sm font-semibold text-[var(--aera-terracotta)]">Clear filters</button>}</div>
    {results.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{results.map((exercise) => {
      const media = getMediaAsset(exercise.mediaId);
      return <Link key={exercise.id} href={exercise.href} className="group overflow-hidden rounded-xl border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"><div className={`relative h-36 overflow-hidden ${exercise.curated ? "bg-[var(--aera-stone)]" : "aera-grid-bg bg-[var(--aera-stone)]"}`}>{media && <Image src={media.src} alt="" fill className="object-cover transition duration-300 group-hover:scale-[1.02]" sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw" />}{exercise.curated ? <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">AERA curated</span> : <div className="absolute inset-0 grid place-items-center text-black/30"><Database size={35} strokeWidth={1.4} /></div>}</div><div className="p-4"><div className="flex items-start justify-between gap-3"><h2 className="text-[18px] font-bold tracking-[-.02em]">{exercise.name}</h2><span className="max-w-28 rounded-md bg-[var(--aera-ivory)] px-2 py-1 text-right text-[9px] font-bold uppercase leading-3 text-black/50">{exercise.difficulty}</span></div><p className="mt-3 line-clamp-2 text-sm leading-5 text-black/55">{exercise.summary}</p><p className="mt-4 line-clamp-1 text-xs font-semibold text-[var(--aera-forest)]">{exercise.muscleNames.join(" · ")}</p><p className="mt-1 line-clamp-1 text-xs text-black/45">{exercise.equipmentNames.join(", ")}</p></div></Link>;
    })}</div> : <div className="rounded-xl border border-dashed border-black/20 bg-white p-10 text-center"><p className="font-semibold">No matching exercises</p><p className="mt-1 text-sm text-black/50">Try removing one of the filters.</p></div>}
  </div>;
}

function valueItem(value: string) { return { id: value, name: value }; }
function Filter({ label, value, onChange, items }: { label: string; value: string; onChange: (value: string) => void; items: { id: string; name: string }[] }) { return <label className="shrink-0"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 max-w-56 rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold outline-none"><option value={all}>{label}</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>; }

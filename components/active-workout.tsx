"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Pause, Play, RotateCcw } from "lucide-react";
import { getMediaAsset } from "@/lib/media/catalog";
import { useEffect, useState } from "react";
import { readLocalData, updateLocalData } from "@/lib/local-data";

export function ActiveWorkout() {
  const [completedSets, setCompletedSets] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => { const saved = readLocalData().workout; setCompletedSets(saved.completedSets); setPaused(saved.paused); }); return () => cancelAnimationFrame(frame); }, []);
  const persist = (sets: number, isPaused: boolean, completedAt?: string) => updateLocalData((current) => ({ ...current, workout: { completedSets: sets, paused: isPaused, completedAt } }));
  const completeSet = () => {
    const next = Math.min(3, completedSets + 1);
    setCompletedSets(next);
    persist(next, false, next === 3 ? new Date().toISOString() : undefined);
  };
  const togglePause = () => { const next = !paused; setPaused(next); persist(completedSets, next); };
  const reset = () => { setCompletedSets(0); setPaused(false); persist(0, false); };
  const poster = getMediaAsset("TRAINING_SHOULDER_PRESS");
  const text = {
    back: "Back to workout", progress: "Exercise 3 of 5", target: "Shoulders", sets: "Set 2 of 3", reps: "Reps", load: "Load", rest: "Rest after set", complete: "Complete Set", skip: "Skip", replace: "Replace Exercise", pause: "Pause workout",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between"><Link href="/training/workout" aria-label={text.back} className="grid size-11 place-items-center rounded-lg border border-black/10 bg-white"><ArrowLeft size={20} /></Link><button type="button" aria-pressed={paused} onClick={togglePause} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-black/55">{paused ? <Play size={17} /> : <Pause size={17} />} {paused ? "Resume workout" : text.pause}</button></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--aera-stone)]"><div className="h-full rounded-full bg-[var(--aera-forest)] transition-all" style={{ width: `${completedSets / 3 * 100}%` }} /></div>
      <section className="overflow-hidden rounded-2xl bg-[var(--aera-ink)] text-white">
        <div className="relative h-[330px] overflow-hidden sm:h-[430px]">{poster && <Image src={poster.src} alt={poster.alt} fill className="object-cover object-center" sizes="(max-width: 640px) 100vw, 896px" priority />}</div>
        <div className="p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-white/50">{text.progress} · {text.target}</p><h1 className="mt-2 text-[30px] font-bold tracking-[-.03em] sm:text-[40px]">Dumbbell Shoulder Press</h1><div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/15"><Metric label={text.sets} value={`${completedSets} / 3`} /><Metric label={text.reps} value="10" /><Metric label={text.load} value="12 kg" /></div></div>
      </section>
      <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-black/40">{text.rest}</p><p className="mt-1 text-2xl font-bold">01:15</p></div><button type="button" onClick={reset} aria-label="Reset workout progress" className="grid size-11 place-items-center rounded-lg bg-[var(--aera-ivory)]"><RotateCcw size={18} /></button></div>
      <button type="button" onClick={completeSet} disabled={paused || completedSets === 3} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[var(--aera-terracotta)] px-6 text-base font-bold text-white disabled:opacity-50">{completedSets === 3 && <Check size={19} />}{completedSets === 3 ? "Exercise completed" : text.complete}</button>
      <div className="grid grid-cols-2 gap-3"><button type="button" className="min-h-12 rounded-lg border border-black/15 bg-white font-semibold">{text.skip}</button><button type="button" className="min-h-12 rounded-lg border border-black/15 bg-white font-semibold">{text.replace}</button></div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="bg-white/5 p-3"><p className="text-[9px] font-bold uppercase tracking-[.09em] text-white/45">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>; }

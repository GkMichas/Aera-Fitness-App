"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { readLocalData, updateLocalData } from "@/lib/local-data";

export function GoalsEditor() {
  const [saved, setSaved] = useState(false);
  const [goal, setGoal] = useState("muscle_gain");
  const [days, setDays] = useState(4);
  useEffect(() => { const frame = requestAnimationFrame(() => { const current = readLocalData().acceptedProgram; if (current) { setGoal(current.goal); setDays(current.daysPerWeek); setSaved(true); } }); return () => cancelAnimationFrame(frame); }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateLocalData((current) => ({ ...current, acceptedProgram: { acceptedAt: new Date().toISOString(), goal, experience: current.acceptedProgram?.experience ?? "intermediate", daysPerWeek: days, sessionDurationMinutes: current.acceptedProgram?.sessionDurationMinutes ?? 45, equipmentIds: current.acceptedProgram?.equipmentIds ?? ["bodyweight", "dumbbells"], workoutCount: days, rulesVersion: current.acceptedProgram?.rulesVersion ?? "aera-programming-v1" } }));
    setSaved(true);
  }
  return <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6"><header><Link href="/you" className="inline-flex items-center gap-2 text-sm font-bold text-black/55"><ArrowLeft size={16} /> You</Link><p className="mt-6 text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-terracotta)]">Goals</p><h1 className="mt-2 text-[36px] font-bold tracking-[-.035em] sm:text-[48px]">Set your direction</h1><p className="mt-3 text-sm leading-6 text-black/55">These choices become the defaults for your deterministic training plan.</p></header><section className="space-y-5 rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><label className="block text-xs font-bold uppercase tracking-[.1em] text-black/45">Primary goal<select value={goal} onChange={(event) => { setGoal(event.target.value); setSaved(false); }} className="mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-[var(--aera-ivory)] px-4 text-base font-semibold text-black"><option value="fat_loss">Lose fat</option><option value="muscle_gain">Build muscle</option><option value="strength">Get stronger</option><option value="general_fitness">Improve general fitness</option><option value="maintenance">Maintain</option></select></label><label className="block text-xs font-bold uppercase tracking-[.1em] text-black/45">Training days per week<select value={days} onChange={(event) => { setDays(Number(event.target.value)); setSaved(false); }} className="mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-[var(--aera-ivory)] px-4 text-base font-semibold text-black">{[1,2,3,4,5,6].map((value) => <option key={value} value={value}>{value} {value === 1 ? "day" : "days"}</option>)}</select></label></section><button type="submit" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[var(--aera-terracotta)] text-base font-bold text-white">{saved && <Check size={19} />}{saved ? "Goals saved" : "Save goals"}</button><Link href="/training/program" className="flex min-h-12 items-center justify-center rounded-lg border border-black/15 bg-white text-sm font-bold">Build a plan from these goals</Link></form>;
}

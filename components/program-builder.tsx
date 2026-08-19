"use client";

import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { trainingCatalog, getExercise, getMuscleName } from "@/lib/training/catalog";
import { programmingEngine } from "@/lib/training/programming-engine";
import type { ProgrammingInput, TrainingExperience, TrainingGoal } from "@/types/programming";
import { readLocalData, updateLocalData } from "@/lib/local-data";

export function ProgramBuilder() {
  const [goal, setGoal] = useState<TrainingGoal>("muscle_gain");
  const [experience, setExperience] = useState<TrainingExperience>("intermediate");
  const [days, setDays] = useState<ProgrammingInput["daysPerWeek"]>(4);
  const [duration, setDuration] = useState<ProgrammingInput["sessionDurationMinutes"]>(45);
  const [equipment, setEquipment] = useState(["bodyweight", "mat", "dumbbells", "bench", "resistance-band"]);
  const [accepted, setAccepted] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setAccepted(Boolean(readLocalData().acceptedProgram))); return () => cancelAnimationFrame(frame); }, []);
  const input = useMemo<ProgrammingInput>(() => ({ goal, experience, daysPerWeek: days, sessionDurationMinutes: duration, equipmentIds: equipment }), [days, duration, equipment, experience, goal]);
  const plan = useMemo(() => programmingEngine.generate(input, trainingCatalog), [input]);
  const toggleEquipment = (id: string) => setEquipment((current) => current.includes(id) ? (current.length === 1 ? current : current.filter((item) => item !== id)) : [...current, id]);
  const acceptPlan = () => {
    updateLocalData((current) => ({ ...current, acceptedProgram: { acceptedAt: new Date().toISOString(), goal, experience, daysPerWeek: days, sessionDurationMinutes: duration, equipmentIds: equipment, workoutCount: plan.workouts.length, rulesVersion: plan.rulesVersion } }));
    setAccepted(true);
  };

  return <div className="space-y-7">
    <header className="flex items-start gap-4"><Link href="/training" aria-label="Back to training" className="mt-1 grid size-11 shrink-0 place-items-center rounded-lg border border-black/10 bg-white"><ArrowLeft size={20} /></Link><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-forest)]">Deterministic Training Engine · v1</p><h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">Build your week</h1><p className="mt-3 max-w-2xl text-[15px] leading-6 text-black/55">Every prescription comes from versioned rules and curated exercise metadata. No AI owns the training arithmetic.</p></div></header>
    <section className="grid gap-4 rounded-xl border border-black/10 bg-white p-5 md:grid-cols-4">
      <Select label="Goal" value={goal} onChange={(value) => setGoal(value as TrainingGoal)} options={[{ value: "fat_loss", label: "Fat loss" }, { value: "muscle_gain", label: "Build muscle" }, { value: "strength", label: "Strength" }, { value: "general_fitness", label: "General fitness" }, { value: "maintenance", label: "Maintenance" }]} />
      <Select label="Experience" value={experience} onChange={(value) => setExperience(value as TrainingExperience)} options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }]} />
      <Select label="Days per week" value={String(days)} onChange={(value) => setDays(Number(value) as ProgrammingInput["daysPerWeek"])} options={[1,2,3,4,5,6].map((value) => ({ value: String(value), label: `${value} ${value === 1 ? "day" : "days"}` }))} />
      <Select label="Session duration" value={String(duration)} onChange={(value) => setDuration(Number(value) as ProgrammingInput["sessionDurationMinutes"])} options={[15,30,45,60].map((value) => ({ value: String(value), label: `${value} min` }))} />
      <fieldset className="md:col-span-4"><legend className="text-[10px] font-bold uppercase tracking-[.1em] text-black/45">Available equipment</legend><div className="mt-2 flex flex-wrap gap-2">{trainingCatalog.equipment.map((item) => { const selected = equipment.includes(item.id); return <button key={item.id} type="button" aria-pressed={selected} onClick={() => toggleEquipment(item.id)} className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${selected ? "border-[var(--aera-forest)] bg-[var(--aera-forest)] text-white" : "border-black/15 bg-white text-black/55"}`}>{selected && <Check size={14} />}{item.name}</button>; })}</div></fieldset>
    </section>
    <section><div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.13em] text-black/40">Generated week</p><h2 className="mt-1 text-2xl font-bold">{plan.workouts.length} workouts</h2></div><span className="rounded-md bg-[var(--aera-stone)] px-2.5 py-1.5 text-[10px] font-bold uppercase text-black/45">{plan.rulesVersion}</span></div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">{plan.workouts.map((workout) => <article key={workout.id} className="overflow-hidden rounded-xl border border-black/10 bg-white"><div className="flex items-start justify-between bg-[var(--aera-forest)] p-4 text-white"><div><p className="text-[9px] font-bold uppercase tracking-[.12em] text-white/55">Day {workout.day} · {workout.durationMinutes} min</p><h3 className="mt-1 text-xl font-bold">{workout.name}</h3></div><span className="text-xs font-semibold capitalize text-white/65">{workout.difficulty}</span></div><div className="divide-y divide-black/10">{workout.exercises.map((item) => { const exercise = getExercise(item.exerciseId)!; return <div key={item.exerciseId} className="flex items-center justify-between gap-3 px-4 py-3"><div><p className="font-semibold">{exercise.name}</p><p className="mt-1 text-xs text-black/45">{exercise.primaryMuscleIds.map(getMuscleName).join(", ")} · {item.restSeconds}s rest · {item.targetRir} RIR</p></div><span className="shrink-0 text-sm font-bold">{item.sets} × {item.reps ?? `${item.durationSeconds}s`}</span></div>; })}</div></article>)}</div>
    </section>
    <section className="rounded-xl border border-black/10 bg-white p-5"><div className="flex items-center gap-2"><ShieldCheck size={18} className="text-[var(--aera-forest)]" /><h2 className="font-bold">Why this plan</h2></div><ul className="mt-3 space-y-2 text-sm leading-6 text-black/60">{plan.rationale.map((item) => <li key={item}>• {item}</li>)}</ul>{plan.warnings.map((item) => <p key={item} className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{item}</p>)}</section>
    <button type="button" onClick={acceptPlan} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[var(--aera-terracotta)] px-6 text-base font-bold text-white"><Check size={18} /> {accepted ? "Plan saved on this device" : "Use this plan"}</button>
  </div>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) { return <label className="flex flex-col gap-2"><span className="text-[10px] font-bold uppercase tracking-[.1em] text-black/45">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-lg border border-black/15 bg-[var(--aera-ivory)] px-3 text-sm font-semibold outline-none">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>; }

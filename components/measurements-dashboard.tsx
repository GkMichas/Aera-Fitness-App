"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { ProgressLineChart } from "@/components/progress-chart";
import type { MeasurementPoint } from "@/types/progress";
import { readLocalData, updateLocalData } from "@/lib/local-data";

const fields = [{ key: "waistCm", label: "Waist" }, { key: "neckCm", label: "Neck" }, { key: "chestCm", label: "Chest" }, { key: "armCm", label: "Arm" }, { key: "thighCm", label: "Thigh" }, { key: "calfCm", label: "Calf" }] as const;

export function MeasurementsDashboard({ initialMeasurements, isDemo }: { initialMeasurements: MeasurementPoint[]; isDemo: boolean }) {
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    if (!isDemo) return;
    const frame = requestAnimationFrame(() => { const saved = readLocalData().measurements; if (saved.length) setMeasurements([...initialMeasurements, ...saved]); });
    return () => cancelAnimationFrame(frame);
  }, [initialMeasurements, isDemo]);
  const latest = measurements.at(-1);
  const previous = measurements.at(-2);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (key: string) => { const raw = String(form.get(key) ?? ""); return raw ? Number(raw) : undefined; };
    const measurement = { date: new Date().toISOString().slice(0, 10), weightKg: value("weightKg"), waistCm: value("waistCm"), neckCm: value("neckCm"), chestCm: value("chestCm"), armCm: value("armCm"), thighCm: value("thighCm"), calfCm: value("calfCm") };
    setMeasurements((current) => [...current, measurement]);
    if (isDemo) updateLocalData((current) => ({ ...current, measurements: [...current.measurements, measurement] }));
    setAdding(false);
  }

  return <div className="mx-auto max-w-3xl space-y-6">
    <header className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Link href="/progress" aria-label="Back to progress" className="grid size-11 place-items-center rounded-lg border border-black/10 bg-white"><ArrowLeft size={19} /></Link><div><h1 className="text-2xl font-bold">Measurements</h1>{isDemo && <p className="mt-1 text-xs text-black/45">Preview data · additions stay in this browser view</p>}</div></div><button type="button" onClick={() => setAdding(true)} className="flex min-h-11 items-center gap-2 rounded-lg bg-[var(--aera-terracotta)] px-4 text-sm font-bold text-white"><Plus size={17} /> Add</button></header>
    <section className="rounded-2xl border border-black/10 bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-black/40">Weight · latest</p><div className="mt-2 flex items-end justify-between gap-4"><p className="text-3xl font-bold">{latest?.weightKg ?? "—"} {latest?.weightKg !== undefined && <span className="text-base text-black/45">kg</span>}</p><p className="text-xs font-bold text-[var(--aera-success)]">{difference(previous?.weightKg, latest?.weightKg, "kg")}</p></div></section>
    <section className="overflow-hidden rounded-2xl border border-black/10">{fields.map(({ key, label }) => <div key={key} className="flex items-center justify-between border-b border-black/8 bg-white px-5 py-4 last:border-0"><span className="font-semibold">{label}</span><span className="text-sm"><strong>{latest?.[key] ?? "—"}{latest?.[key] !== undefined && " cm"}</strong><span className="ml-3 text-xs text-black/40">{difference(previous?.[key], latest?.[key], "")}</span></span></div>)}</section>
    <section className="rounded-2xl border border-black/10 bg-white p-5"><div className="flex justify-between gap-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-black/40">Waist history</p><p className="text-xs text-black/45">All recorded values</p></div><div className="mt-4"><ProgressLineChart points={measurements.flatMap((point) => point.waistCm === undefined ? [] : [{ label: shortDate(point.date), value: point.waistCm }])} unit="cm" minimumSpan={5} color="var(--aera-recovery-blue)" /></div></section>
    <section><p className="text-[10px] font-bold uppercase tracking-[.12em] text-black/40">History</p><div className="mt-3 space-y-2">{[...measurements].reverse().slice(0, 6).map((point, index) => <div key={`${point.date}-${index}`} className="flex justify-between rounded-xl border border-black/10 bg-white p-4 text-sm"><span className="font-semibold">{longDate(point.date)}</span><span className="text-black/55">{point.weightKg ?? "—"} kg · {point.waistCm ?? "—"} cm</span></div>)}</div></section>
    {adding && <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-0 sm:place-items-center sm:p-5"><form onSubmit={submit} className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Add measurement</h2><p className="mt-1 text-xs text-black/45">Use consistent conditions for better trends.</p></div><button type="button" onClick={() => setAdding(false)} aria-label="Close" className="grid size-10 place-items-center"><X size={19} /></button></div><div className="mt-5 grid grid-cols-2 gap-3"><NumberField name="weightKg" label="Weight" unit="kg" required />{fields.map((field) => <NumberField key={field.key} name={field.key} label={field.label} unit="cm" />)}</div><button type="submit" className="mt-5 min-h-12 w-full rounded-lg bg-[var(--aera-terracotta)] text-sm font-bold text-white">Save measurement</button>{isDemo && <p className="mt-3 text-center text-xs text-black/45">Preview mode: this entry is not synced to an account.</p>}</form></div>}
  </div>;
}

function NumberField({ name, label, unit, required }: { name: string; label: string; unit: string; required?: boolean }) { return <label className="text-xs font-bold text-black/50">{label}<span className="mt-1 flex items-center rounded-lg bg-[var(--aera-stone)] px-3"><input name={name} type="number" min="1" max="400" step="0.1" required={required} className="min-h-11 min-w-0 flex-1 bg-transparent text-base font-bold text-black outline-none" /><span>{unit}</span></span></label>; }
function difference(start?: number, end?: number, unit = "") { if (start === undefined || end === undefined) return "—"; const value = Number((end - start).toFixed(1)); return `${value > 0 ? "+" : ""}${value}${unit ? ` ${unit}` : ""}`; }
function shortDate(date: string) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
function longDate(date: string) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

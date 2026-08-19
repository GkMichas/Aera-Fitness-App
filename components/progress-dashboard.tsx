"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Camera, LockKeyhole } from "lucide-react";
import { calculateAdherence, calculateChange, linearTrend } from "@/lib/progress/calculations";
import { ProgressBarChart, ProgressLineChart } from "@/components/progress-chart";
import { getProgressPhotoStyle } from "@/lib/media/catalog";
import type { ProgressDashboardData, ProgressMetric } from "@/types/progress";

const tabs: { id: ProgressMetric; label: string }[] = [
  { id: "weight", label: "Weight" }, { id: "waist", label: "Waist" }, { id: "strength", label: "Strength" }, { id: "training", label: "Training" }, { id: "nutrition", label: "Nutrition" },
];
const frames = [{ id: 1, label: "1M" }, { id: 3, label: "3M" }, { id: 6, label: "6M" }, { id: 0, label: "All" }];

export function ProgressDashboard({ data }: { data: ProgressDashboardData }) {
  const [metric, setMetric] = useState<ProgressMetric>("weight");
  const [months, setMonths] = useState(3);
  const [photoView, setPhotoView] = useState<"front" | "side">("front");
  const latestDate = data.measurements.at(-1)?.date ?? new Date().toISOString().slice(0, 10);
  const cutoff = useMemo(() => { const date = new Date(`${latestDate}T00:00:00Z`); date.setUTCMonth(date.getUTCMonth() - months); return date.toISOString().slice(0, 10); }, [latestDate, months]);
  const measurements = data.measurements.filter((point) => !months || point.date >= cutoff);
  const latest = data.measurements.at(-1);
  const earliest = measurements[0];
  const weightChange = calculateChange(earliest?.weightKg, latest?.weightKg);
  const waistChange = calculateChange(earliest?.waistCm, latest?.waistCm);
  const photoPair = data.photos.filter((photo) => photo.view === photoView).slice(-2);
  const photoWeeks = photoPair.length === 2 ? Math.round((new Date(`${photoPair[1].capturedOn}T00:00:00Z`).getTime() - new Date(`${photoPair[0].capturedOn}T00:00:00Z`).getTime()) / 604_800_000) : undefined;

  return <div className="space-y-7">
    <header className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-terracotta)]">Body dashboard</p><h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">Progress</h1></div><Link href="/measurements" className="min-h-11 rounded-lg border border-black/15 bg-white px-4 py-3 text-sm font-bold">Measurements</Link></header>

    <nav className="flex gap-5 overflow-x-auto border-b border-black/10" aria-label="Progress metrics">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setMetric(tab.id)} aria-pressed={metric === tab.id} className={`min-h-11 shrink-0 border-b-2 text-sm font-semibold ${metric === tab.id ? "border-black text-black" : "border-transparent text-black/45"}`}>{tab.label}</button>)}</nav>

    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7">
      <MetricHeader metric={metric} data={data} measurements={measurements} />
      <div className="mt-6">
        {metric === "weight" && <ProgressLineChart points={measurements.flatMap((point) => point.weightKg === undefined ? [] : [{ label: shortDate(point.date), value: point.weightKg }])} unit="kg" minimumSpan={5} />}
        {metric === "waist" && <ProgressLineChart points={measurements.flatMap((point) => point.waistCm === undefined ? [] : [{ label: shortDate(point.date), value: point.waistCm }])} unit="cm" color="var(--aera-recovery-blue)" minimumSpan={5} />}
        {metric === "strength" && <ProgressLineChart points={data.strength.filter((point) => !months || point.date >= cutoff).map((point) => ({ label: shortDate(point.date), value: point.estimatedOneRepMaxKg }))} unit="kg e1RM" color="var(--aera-terracotta)" minimumSpan={10} />}
        {metric === "training" && <ProgressBarChart points={data.training.map((point) => ({ label: shortDate(point.weekStart), value: calculateAdherence(point.completed, point.planned) ?? 0 }))} />}
        {metric === "nutrition" && <ProgressBarChart points={data.nutrition.map((point) => ({ label: shortDate(point.weekStart), value: point.adherencePercent }))} color="var(--aera-sage)" />}
      </div>
      {(metric === "weight" || metric === "waist" || metric === "strength") && <div className="mt-5 flex w-max overflow-hidden rounded-lg border border-black/15">{frames.map((frame) => <button key={frame.id} type="button" onClick={() => setMonths(frame.id)} className={`min-h-10 px-4 text-xs font-bold ${months === frame.id ? "bg-[var(--aera-ink)] text-white" : "bg-white text-black/55"}`}>{frame.label}</button>)}</div>}
    </section>

    <section className="grid gap-4 sm:grid-cols-3"><Stat label="Current weight" value={latest?.weightKg === undefined ? "—" : `${latest.weightKg} kg`} change={formatChange(weightChange, "kg")} /><Stat label="Target weight" value={data.targetWeightKg === undefined ? "Not set" : `${data.targetWeightKg} kg`} change="User-defined target" /><Stat label="Waist" value={latest?.waistCm === undefined ? "—" : `${latest.waistCm} cm`} change={formatChange(waistChange, "cm")} /></section>

    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-black/45"><Camera size={14} /> Photo comparison</p><h2 className="mt-2 text-xl font-bold">{photoWeeks === undefined ? "Build a comparison" : `${photoWeeks} weeks apart`}</h2></div><div className="flex items-center gap-3"><Link href="/you/photos" className="text-xs font-bold text-[var(--aera-terracotta)]">View all</Link><div className="flex rounded-lg bg-[var(--aera-stone)] p-1">{(["front", "side"] as const).map((view) => <button key={view} type="button" onClick={() => setPhotoView(view)} className={`min-h-9 rounded-md px-4 text-xs font-bold capitalize ${photoView === view ? "bg-white" : "text-black/50"}`}>{view}</button>)}</div></div></div>
      {photoPair.length === 2 ? <div className="mt-5 grid grid-cols-2 gap-3">{photoPair.map((photo, index) => <div key={photo.id}><div className={`relative aspect-[3/4] overflow-hidden rounded-xl ${index ? "bg-[linear-gradient(160deg,#d9c7aa,#8fa99a)]" : "bg-[linear-gradient(160deg,#e9e6e0,#6f8792)]"}`} style={getProgressPhotoStyle(photo)} role="img" aria-label={`${photo.isDemo ? "Demo " : ""}${photo.view} progress photo from ${longDate(photo.capturedOn)}`}>{!photo.url && <div className="absolute inset-x-[28%] bottom-0 top-[14%] rounded-[48%_48%_18%_18%] bg-white/25" />}{photo.isDemo && <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">Demo</span>}</div><p className="mt-2 text-xs font-semibold">{longDate(photo.capturedOn)}</p></div>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-black/15 p-8 text-center text-sm text-black/50">Two matching photos are needed for comparison.</div>}
      <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-black/45"><LockKeyhole size={14} /> Real progress photos stay private to your account. Synthetic demo media is always labeled.</p>
    </section>
    <p className="text-xs leading-5 text-black/45">Trends use recorded values only. Displayed chart ranges are shown explicitly and use a minimum span to avoid exaggerating small changes.</p>
  </div>;
}

function MetricHeader({ metric, data, measurements }: { metric: ProgressMetric; data: ProgressDashboardData; measurements: ProgressDashboardData["measurements"] }) {
  const config = metric === "weight" ? { label: "Weight trend", unit: "kg", values: measurements.flatMap((point) => point.weightKg ?? []) }
    : metric === "waist" ? { label: "Waist trend", unit: "cm", values: measurements.flatMap((point) => point.waistCm ?? []) }
    : metric === "strength" ? { label: data.strength.at(-1)?.exercise ?? "Strength", unit: "kg e1RM", values: data.strength.map((point) => point.estimatedOneRepMaxKg) }
    : metric === "training" ? { label: "Training consistency", unit: "%", values: data.training.map((point) => calculateAdherence(point.completed, point.planned) ?? 0) }
    : { label: "Nutrition adherence", unit: "%", values: data.nutrition.map((point) => point.adherencePercent) };
  const current = config.values.at(-1);
  const change = calculateChange(config.values[0], current);
  const trend = linearTrend(config.values);
  return <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-black/40">{config.label}</p><p className="mt-2 text-3xl font-bold">{current ?? "—"} <span className="text-base text-black/45">{config.unit}</span></p></div><p className="text-sm font-semibold text-black/55">{change === undefined ? "More data needed" : `${change > 0 ? "+" : ""}${change} ${config.unit}`} · slope {trend ?? "—"}</p></div>;
}

function Stat({ label, value, change }: { label: string; value: string; change: string }) { return <div className="rounded-2xl border border-black/10 bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-black/40">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs font-semibold text-[var(--aera-success)]">{change}</p></div>; }
function formatChange(value: number | undefined, unit: string) { return value === undefined ? "More data needed" : `${value > 0 ? "+" : ""}${value} ${unit} in selected timeframe`; }
function shortDate(date: string) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
function longDate(date: string) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

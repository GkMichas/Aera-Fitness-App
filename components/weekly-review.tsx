"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { formatMinutes } from "@/lib/progress/calculations";
import type { WeeklyReviewResult } from "@/types/progress";
import { readLocalData, updateLocalData } from "@/lib/local-data";

export function WeeklyReview({ review, isDemo }: { review: WeeklyReviewResult; isDemo: boolean }) {
  const [kept, setKept] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setKept(readLocalData().acceptedWeeklyReview?.weekStart === review.weekStart)); return () => cancelAnimationFrame(frame); }, [review.weekStart]);
  function keepPlan() {
    updateLocalData((current) => ({ ...current, acceptedWeeklyReview: { weekStart: review.weekStart, acceptedAt: new Date().toISOString() } }));
    setKept(true);
  }
  return <div className="mx-auto max-w-3xl space-y-7">
    <header><div className="flex items-center gap-3"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-black/45">{formatRange(review.weekStart, review.weekEnd)}</p>{isDemo && <span className="rounded-full bg-[var(--aera-stone)] px-3 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-black/45">Preview data</span>}</div><h1 className="mt-3 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">{review.title}</h1></header>
    <section className="divide-y divide-black/10 border-y border-black/10">
      <Row label="Body" value={review.weightChangeKg === undefined ? "Not enough data" : `${signed(review.weightChangeKg)} kg`} />
      <Row label="Waist" value={review.waistChangeCm === undefined ? "Not enough data" : `${signed(review.waistChangeCm)} cm`} />
      <Row label="Training" value={review.trainingAdherencePercent === undefined ? "No plan recorded" : `${review.trainingAdherencePercent}% adherence`} />
      <Row label="Nutrition" value={review.nutritionAdherencePercent === undefined ? "No target recorded" : `${review.nutritionAdherencePercent}% adherence`} />
      <Row label="Sleep" value={review.averageSleepMinutes === undefined ? "Not recorded" : `${formatMinutes(review.averageSleepMinutes)} average`} />
    </section>
    <section className="rounded-2xl bg-[var(--aera-forest)] p-6 text-white sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-white/55">AERA says</p><p className="mt-3 text-lg leading-8">{review.insight}</p></section>
    <section className="rounded-2xl border border-black/10 bg-white p-6"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-black/40">Recommendation</p><p className="mt-3 text-lg font-bold leading-7">{review.recommendation}</p><details className="mt-5 border-t border-black/8 pt-4"><summary className="cursor-pointer text-sm font-bold text-[var(--aera-terracotta)]">Why this recommendation?</summary><ul className="mt-3 space-y-2">{review.evidence.map((item) => <li key={item} className="text-sm leading-6 text-black/60">• {item}</li>)}</ul><p className="mt-3 text-xs text-black/40">Rules: {review.rulesVersion}</p></details></section>
    <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={keepPlan} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--aera-terracotta)] px-5 text-sm font-bold text-white">{kept && <Check size={17} />}{kept ? "Plan saved" : "Keep plan"}</button><Link href="/coach" className="flex min-h-12 items-center justify-center rounded-lg border border-black/15 bg-white px-5 text-sm font-bold">Discuss with AERA</Link></div>
    <p className="text-xs leading-5 text-black/45">Every conclusion above is generated from the listed records by deterministic rules. Missing data is shown as missing, never invented.</p>
  </div>;
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex items-baseline justify-between gap-5 py-4"><span className="text-[10px] font-bold uppercase tracking-[.12em] text-black/40">{label}</span><span className="text-right text-base font-bold">{value}</span></div>; }
function signed(value: number) { return `${value > 0 ? "+" : ""}${value}`; }
function formatRange(start: string, end: string) { const format = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", timeZone: "UTC" }); return `${format.format(new Date(`${start}T00:00:00Z`))}–${format.format(new Date(`${end}T00:00:00Z`))}`; }

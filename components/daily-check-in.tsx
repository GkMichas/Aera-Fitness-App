"use client";

/* eslint-disable react/no-unescaped-entities */

import { FormEvent, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { readLocalData, updateLocalData } from "@/lib/local-data";

export function DailyCheckIn() {
  const [saved, setSaved] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setSaved(readLocalData().checkIns.some((item) => item.date === today()))); return () => cancelAnimationFrame(frame); }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record = { date: today(), energy: Number(form.get("energy")), sleepHours: Number(form.get("sleep")), soreness: Number(form.get("soreness")), mood: Number(form.get("mood")), note: String(form.get("note") ?? "").trim().slice(0, 500) };
    updateLocalData((current) => ({ ...current, checkIns: [...current.checkIns.filter((item) => item.date !== record.date), record] }));
    setSaved(true);
  }
  return <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6"><header><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-recovery-blue)]">Daily check-in</p><h1 className="mt-2 text-[36px] font-bold tracking-[-.035em] sm:text-[48px]">How are you today?</h1><p className="mt-3 text-sm leading-6 text-black/55">A quick snapshot helps AERA interpret training and recovery trends.</p></header><section className="space-y-5 rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><Scale name="energy" label="Energy" low="Low" high="High" /><Scale name="mood" label="Mood" low="Low" high="Great" /><Scale name="soreness" label="Soreness" low="None" high="Strong" /><label className="block text-sm font-bold">Sleep last night<span className="mt-2 flex items-center rounded-lg bg-[var(--aera-stone)] px-4"><input name="sleep" type="number" min="0" max="24" step="0.5" defaultValue="7.5" required className="min-h-12 min-w-0 flex-1 bg-transparent text-base outline-none" /><span className="text-sm text-black/45">hours</span></span></label><label className="block text-sm font-bold">Optional note<textarea name="note" maxLength={500} rows={3} className="mt-2 w-full rounded-lg bg-[var(--aera-stone)] p-4 font-normal outline-none" placeholder="Anything affecting your day?" /></label></section><button type="submit" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[var(--aera-terracotta)] text-base font-bold text-white">{saved && <Check size={19} />}{saved ? "Update today's check-in" : "Save check-in"}</button>{saved && <p role="status" className="text-center text-sm font-bold text-emerald-800">Today's check-in is saved on this device.</p>}</form>;
}
function Scale({ name, label, low, high }: { name: string; label: string; low: string; high: string }) { return <label className="block text-sm font-bold">{label}<input name={name} type="range" min="1" max="5" defaultValue="3" className="mt-3 block w-full accent-[var(--aera-forest)]" /><span className="mt-1 flex justify-between text-[10px] font-normal uppercase tracking-[.08em] text-black/40"><span>{low}</span><span>{high}</span></span></label>; }
function today() { return new Date().toISOString().slice(0, 10); }

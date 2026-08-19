"use client";

import Link from "next/link";
import { ChevronRight, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { readLocalData, updateLocalData } from "@/lib/local-data";

export function ProfileDashboard({ isLocalMode }: { isLocalMode: boolean }) {
  const [notifications, setNotifications] = useState(true);
  useEffect(() => { const frame = requestAnimationFrame(() => setNotifications(readLocalData().preferences.notifications)); return () => cancelAnimationFrame(frame); }, []);
  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    updateLocalData((current) => ({ ...current, preferences: { ...current.preferences, notifications: next } }));
  };

  return <div className="mx-auto max-w-3xl space-y-6">
    <header><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-terracotta)]">Profile & settings</p><h1 className="mt-2 text-[36px] font-bold tracking-[-.035em] sm:text-[48px]">You</h1></header>
    <section className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-5"><span className="grid size-14 place-items-center rounded-full bg-[var(--aera-stone)] text-lg font-bold">G</span><div className="min-w-0 flex-1"><h2 className="text-lg font-bold">George</h2><p className="text-sm text-black/50">34 · 170 cm · Build consistency</p></div>{isLocalMode && <span className="rounded-full bg-[var(--aera-stone)] px-3 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-black/50">Local mode</span>}</section>
    <Section title="Body"><Row href="/you/measurements" label="Measurements" value="View history" /><Row href="/you/photos" label="Progress photos" value="Private" /></Section>
    <Section title="Plan & lifestyle"><Row href="/goals" label="Goals" value="Edit" /><Row href="/training/program" label="Training plan" value="Build" /><Row href="/nutrition/plan" label="Nutrition plan" value="View" /><Row href="/weekly-review" label="Weekly review" value="Open" /><Row href="/health" label="AERA Health" value="Safety first" /></Section>
    <section><h2 className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-black/40">Settings</h2><div className="overflow-hidden rounded-2xl border border-black/10 bg-white"><button type="button" onClick={toggleNotifications} aria-pressed={notifications} className="flex min-h-14 w-full items-center justify-between border-b border-black/8 px-5 text-left"><span className="font-semibold">Notifications</span><span className={`relative h-7 w-12 rounded-full transition ${notifications ? "bg-[var(--aera-forest)]" : "bg-black/15"}`}><span className={`absolute top-1 size-5 rounded-full bg-white transition ${notifications ? "left-6" : "left-1"}`} /></span></button><Row href="/privacy" label="Privacy & data" value="Manage" /></div></section>
    <p className="flex items-start gap-2 rounded-xl bg-[var(--aera-stone)] p-4 text-xs leading-5 text-black/55"><LockKeyhole size={15} className="mt-0.5 shrink-0" /> {isLocalMode ? "Your changes are stored only in this browser until Supabase is configured." : "Your account data is protected by per-user access policies."}</p>
  </div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-black/40">{title}</h2><div className="overflow-hidden rounded-2xl border border-black/10 bg-white">{children}</div></section>; }
function Row({ href, label, value }: { href: string; label: string; value: string }) { return <Link href={href} className="flex min-h-14 items-center justify-between gap-4 border-b border-black/8 px-5 last:border-0"><span className="font-semibold">{label}</span><span className="flex items-center gap-2 text-sm text-black/45">{value}<ChevronRight size={16} /></span></Link>; }

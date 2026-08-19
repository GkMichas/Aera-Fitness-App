"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import type { ProgressPhoto } from "@/types/progress";
import { getProgressPhotoStyle } from "@/lib/media/catalog";

export function ProgressPhotoLibrary({ photos, isDemo }: { photos: ProgressPhoto[]; isDemo: boolean }) {
  const availableViews = (["front", "side", "back"] as const).filter((view) => photos.some((photo) => photo.view === view));
  const [view, setView] = useState<"front" | "side" | "back">(availableViews[0] ?? "front");
  const pair = photos.filter((photo) => photo.view === view).slice(-2);
  return <div className="mx-auto max-w-4xl space-y-7">
    <header className="flex items-start justify-between gap-4"><div><Link href="/progress" className="inline-flex items-center gap-2 text-sm font-bold text-black/50"><ArrowLeft size={16} /> Progress</Link><h1 className="mt-5 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">Progress photos</h1><p className="mt-3 text-sm text-black/50">Compare the same view under consistent conditions.</p></div>{isDemo && <span className="rounded-full bg-[var(--aera-stone)] px-3 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-black/45">Synthetic demo media</span>}</header>
    <div className="flex w-max rounded-lg bg-[var(--aera-stone)] p-1">{availableViews.map((item) => <button key={item} type="button" onClick={() => setView(item)} className={`min-h-10 rounded-md px-5 text-sm font-bold capitalize ${view === item ? "bg-white" : "text-black/45"}`}>{item}</button>)}</div>
    {pair.length === 2 ? <section className="grid grid-cols-2 gap-4">{pair.map((photo, index) => <div key={photo.id}><div className={`relative aspect-[3/4] overflow-hidden rounded-2xl ${index ? "bg-[linear-gradient(160deg,#d9c7aa,#8fa99a)]" : "bg-[linear-gradient(160deg,#e9e6e0,#6f8792)]"}`} style={getProgressPhotoStyle(photo)} role="img" aria-label={`${photo.isDemo ? "Demo " : ""}${photo.view} progress photo from ${longDate(photo.capturedOn)}`}>{!photo.url && <div className="absolute inset-x-[28%] bottom-0 top-[14%] rounded-[48%_48%_18%_18%] bg-white/25" />}{photo.isDemo && <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">Demo</span>}</div><p className="mt-3 text-sm font-bold">{longDate(photo.capturedOn)}</p></div>)}</section> : <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center"><p className="font-bold">Two matching photos are needed</p><p className="mt-2 text-sm text-black/50">Add another {view} photo to enable comparison.</p></div>}
    <p className="flex items-start gap-2 rounded-xl bg-[var(--aera-stone)] p-4 text-xs leading-5 text-black/55"><LockKeyhole size={15} className="mt-0.5 shrink-0" /> Photos use private storage and short-lived signed URLs. They are never exposed through a public bucket.</p>
  </div>;
}

function longDate(date: string) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

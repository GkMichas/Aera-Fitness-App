"use client";

import Link from "next/link";

export default function ErrorScreen({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-7 text-center"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-critical)]">Something went wrong</p><h1 className="mt-3 text-3xl font-bold">This view could not load.</h1><p className="mt-3 text-sm leading-6 text-black/55">Your existing data has not been changed. Try the request again or return home.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={reset} className="min-h-12 rounded-lg bg-[var(--aera-terracotta)] font-bold text-white">Try again</button><Link href="/home" className="flex min-h-12 items-center justify-center rounded-lg border border-black/15 font-bold">Return home</Link></div></div>;
}

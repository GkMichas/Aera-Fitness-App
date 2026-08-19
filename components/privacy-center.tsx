"use client";

import Link from "next/link";
import { ArrowLeft, Download, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearLocalData, exportLocalData, readLocalData, updateLocalData } from "@/lib/local-data";

export function PrivacyCenter({ isLocalMode }: { isLocalMode: boolean }) {
  const router = useRouter();
  const [healthConsent, setHealthConsent] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { const frame = requestAnimationFrame(() => { const preferences = readLocalData().preferences; setHealthConsent(preferences.healthStorageConsent); setAnalytics(preferences.analytics); }); return () => cancelAnimationFrame(frame); }, []);
  const setPreference = (key: "healthStorageConsent" | "analytics", value: boolean) => {
    if (key === "healthStorageConsent") setHealthConsent(value); else setAnalytics(value);
    updateLocalData((current) => ({ ...current, preferences: { ...current.preferences, [key]: value } }));
  };
  const exportData = async () => {
    if (isLocalMode) return exportLocalData();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/account/data", { cache: "no-store" });
      if (!response.ok) throw new Error((await response.json()).error ?? "Export failed.");
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `aera-account-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Export failed."); } finally { setBusy(false); }
  };
  const deleteData = async () => {
    if (isLocalMode) {
      if (!window.confirm("Delete all AERA data stored in this browser? This cannot be undone.")) return;
      clearLocalData(); setHealthConsent(false); setAnalytics(false); setDeleted(true); return;
    }
    const confirmation = window.prompt('Type "DELETE MY AERA ACCOUNT" to permanently delete your account.');
    if (confirmation !== "DELETE MY AERA ACCOUNT") return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/account/data", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation }) });
      if (!response.ok) throw new Error((await response.json()).error ?? "Deletion failed.");
      router.push("/"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Deletion failed."); setBusy(false); }
  };
  return <div className="mx-auto max-w-3xl space-y-6">
    <header><Link href="/you" className="inline-flex items-center gap-2 text-sm font-bold text-black/55"><ArrowLeft size={16} /> You</Link><p className="mt-6 text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-forest)]">Privacy center</p><h1 className="mt-2 text-[34px] font-bold tracking-[-.035em] sm:text-[46px]">Your data, your choice</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">Export your data, control optional storage, or erase records. Health details are never used for advertising.</p></header>
    <section className="rounded-2xl border border-black/10 bg-white p-5"><div className="flex gap-3"><ShieldCheck className="text-[var(--aera-forest)]" /><div><h2 className="font-bold">{isLocalMode ? "Stored on this device" : "Private account storage"}</h2><p className="mt-1 text-sm leading-6 text-black/55">{isLocalMode ? "No AERA account or cloud database is connected in this build." : "Supabase row-level security limits access to your own records."}</p></div></div></section>
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white"><Toggle label="Store health assessments" description="Optional. Emergency guidance is always shown even when storage is off." checked={healthConsent} onChange={(value) => setPreference("healthStorageConsent", value)} /><Toggle label="Product analytics" description="Optional usage data. Off by default in local mode." checked={analytics} onChange={(value) => setPreference("analytics", value)} /></section>
    <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={exportData} disabled={busy} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-5 text-sm font-bold disabled:opacity-50"><Download size={17} /> Export JSON</button><button type="button" onClick={deleteData} disabled={busy} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-5 text-sm font-bold text-red-700 disabled:opacity-50"><Trash2 size={17} /> {isLocalMode ? "Delete local data" : "Delete account"}</button></div>
    {deleted && <p role="status" className="rounded-lg bg-emerald-50 p-4 text-sm font-bold text-emerald-900">All local AERA data was deleted.</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
    {!isLocalMode && <p className="rounded-lg bg-amber-50 p-4 text-xs leading-5 text-amber-900">Account deletion is permanent and also removes private progress-photo files.</p>}
  </div>;
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-center justify-between gap-5 border-b border-black/8 p-5 last:border-0"><span><span className="block font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-black/50">{description}</span></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5 accent-[var(--aera-forest)]" /></label>; }

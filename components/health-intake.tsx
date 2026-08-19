"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, ArrowLeft, Check, LockKeyhole, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { EmergencyFlag, HealthIntake as HealthIntakeType, HealthSafetyAssessment } from "@/types/health-safety";

const emergencyOptions: { id: EmergencyFlag; label: string }[] = [
  { id: "chest_pressure", label: "New chest pressure, tightness or pain with sweating, sickness or breathlessness" },
  { id: "severe_breathing", label: "Severe difficulty breathing, gasping, choking or unable to speak normally" },
  { id: "stroke_signs", label: "Sudden face droop, one-sided weakness/numbness or speech difficulty" },
  { id: "unresponsive", label: "Fainting, unconsciousness or not responding normally" },
  { id: "heavy_bleeding", label: "Heavy bleeding that will not stop" },
  { id: "seizure", label: "First seizure, repeated seizures or one lasting over 5 minutes" },
  { id: "overdose_or_self_harm", label: "Overdose, suicide attempt or immediate risk of self-harm" },
];

interface ApiResponse { assessment?: HealthSafetyAssessment; eventId?: string | null; isDemo?: boolean; error?: string; }

export function HealthIntake() {
  const [description, setDescription] = useState("");
  const [bodyArea, setBodyArea] = useState("");
  const [onset, setOnset] = useState<HealthIntakeType["onset"]>();
  const [severity, setSeverity] = useState<number>();
  const [answers, setAnswers] = useState<Pick<HealthIntakeType, "duringExercise" | "injury" | "swelling" | "weakness" | "limitedMovement" | "worsening">>({});
  const [emergencyFlags, setEmergencyFlags] = useState<EmergencyFlag[]>([]);
  const [redFlagsReviewed, setRedFlagsReviewed] = useState(false);
  const [acknowledgedPrivacy, setAcknowledgedPrivacy] = useState(false);
  const [result, setResult] = useState<ApiResponse>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  function toggleFlag(flag: EmergencyFlag) {
    setEmergencyFlags((current) => current.includes(flag) ? current.filter((item) => item !== flag) : [...current, flag]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError(undefined);
    const intake: HealthIntakeType = { description: description.trim() || "Emergency sign selected in structured intake.", bodyArea: bodyArea || undefined, onset, severity, ...answers, emergencyFlags, redFlagsReviewed, acknowledgedPrivacy };
    try {
      const response = await fetch("/api/health/assess", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(intake) });
      const payload = await response.json() as ApiResponse;
      if (!response.ok || !payload.assessment) throw new Error(payload.error || "The safety assessment is unavailable.");
      setResult(payload);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The safety assessment is unavailable."); }
    finally { setPending(false); }
  }

  function reset() {
    setDescription(""); setBodyArea(""); setOnset(undefined); setSeverity(undefined); setAnswers({}); setEmergencyFlags([]); setRedFlagsReviewed(false); setAcknowledgedPrivacy(false); setResult(undefined); setError(undefined);
  }

  if (result?.assessment) return <AssessmentResult assessment={result.assessment} isDemo={Boolean(result.isDemo)} onReset={reset} />;

  const canSubmit = emergencyFlags.length > 0 ? redFlagsReviewed : description.trim().length >= 10 && redFlagsReviewed && acknowledgedPrivacy && severity !== undefined;
  return <div className="mx-auto max-w-4xl space-y-7">
    <header><Link href="/home" className="inline-flex items-center gap-2 text-sm font-bold text-black/50"><ArrowLeft size={16} /> Home</Link><p className="mt-6 text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-recovery-blue)]">AERA Health</p><h1 className="mt-2 max-w-xl text-[34px] font-bold leading-tight tracking-[-.035em] sm:text-[46px]">Something doesn&apos;t feel right?</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">Describe it in your own words. AERA identifies when professional attention may be appropriate — never a diagnosis.</p></header>

    <section className="rounded-2xl border border-[var(--aera-critical)]/35 bg-red-50 p-5"><p className="flex items-center gap-2 text-sm font-bold text-[var(--aera-critical)]"><AlertTriangle size={18} /> Emergency symptoms?</p><p className="mt-2 text-sm leading-6 text-black/65">If someone is unresponsive, has severe breathing difficulty, heavy bleeding, new chest pressure or stroke signs, call local emergency services now. In the EU, call <a href="tel:112" className="font-bold underline">112</a>.</p></section>

    <form onSubmit={submit} className="space-y-5">
      <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <label htmlFor="health-description" className="text-xs font-bold uppercase tracking-[.1em] text-black/45">What are you experiencing?</label>
        <textarea id="health-description" required={emergencyFlags.length === 0} minLength={emergencyFlags.length === 0 ? 10 : undefined} maxLength={2000} value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="For example: My right knee aches when I squat and it started three days ago." className="mt-3 w-full resize-none rounded-xl bg-[var(--aera-ivory)] p-4 text-base leading-7 outline-none focus:ring-2 focus:ring-[var(--aera-recovery-blue)]/30" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3"><Field label="Where exactly?"><input value={bodyArea} onChange={(event) => setBodyArea(event.target.value)} maxLength={80} placeholder="Right knee" className="field-input" /></Field><Field label="When did it start?"><select value={onset ?? ""} onChange={(event) => setOnset(event.target.value as HealthIntakeType["onset"] || undefined)} className="field-input"><option value="">Choose</option><option value="today">Today</option><option value="days">A few days ago</option><option value="weeks">A few weeks ago</option><option value="months">Months ago</option></select></Field><Field label="Severity"><select value={severity ?? ""} onChange={(event) => setSeverity(event.target.value ? Number(event.target.value) : undefined)} className="field-input"><option value="">Choose</option>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} / 10</option>)}</select></Field></div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.1em] text-black/45">Structured follow-up</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{([ ["duringExercise", "During exercise?"], ["injury", "After an injury?"], ["swelling", "Visible swelling?"], ["weakness", "New weakness?"], ["limitedMovement", "Limited movement?"], ["worsening", "Getting worse?"] ] as const).map(([key, label]) => <YesNo key={key} label={label} value={answers[key]} onChange={(value) => setAnswers((current) => ({ ...current, [key]: value }))} />)}</div></section>

      <section className="rounded-2xl border border-[var(--aera-critical)]/25 bg-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.1em] text-[var(--aera-critical)]">Check emergency signs</p><p className="mt-2 text-sm leading-6 text-black/55">Select every sign that applies right now. If any apply, do not wait for an online assessment.</p><div className="mt-4 space-y-2">{emergencyOptions.map((option) => <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl bg-[var(--aera-ivory)] p-3 text-sm leading-5"><input type="checkbox" checked={emergencyFlags.includes(option.id)} onChange={() => toggleFlag(option.id)} className="mt-0.5 size-4 shrink-0 accent-[var(--aera-critical)]" />{option.label}</label>)}</div><label className="mt-4 flex cursor-pointer items-start gap-3 text-sm font-semibold"><input type="checkbox" checked={redFlagsReviewed} onChange={(event) => setRedFlagsReviewed(event.target.checked)} className="mt-0.5 size-4 accent-[var(--aera-forest)]" />I reviewed every emergency sign above.</label></section>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[var(--aera-stone)] p-4 text-xs leading-5 text-black/60"><input type="checkbox" checked={acknowledgedPrivacy} onChange={(event) => setAcknowledgedPrivacy(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[var(--aera-forest)]" /><span><strong className="flex items-center gap-2 text-black"><LockKeyhole size={14} /> Private health information</strong><span className="mt-1 block">I understand this safety assessment may be saved privately to my account when connected. It is not a medical diagnosis.</span></span></label>
      {error && <div role="alert" className="rounded-xl border border-[var(--aera-critical)]/30 bg-red-50 p-4 text-sm leading-6 text-[var(--aera-critical)]">{error} If this may be urgent, contact local emergency or urgent-care services now.</div>}
      <button type="submit" disabled={!canSubmit || pending} className="min-h-13 w-full rounded-lg bg-[var(--aera-forest)] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{pending ? "Applying safety rules…" : emergencyFlags.length ? "Show emergency guidance" : "Review safely"}</button>
    </form>
    <p className="text-xs leading-5 text-black/45">AERA Health is not a medical service and cannot diagnose conditions or rule them out.</p>
  </div>;
}

function AssessmentResult({ assessment, isDemo, onReset }: { assessment: HealthSafetyAssessment; isDemo: boolean; onReset: () => void }) {
  const emergency = assessment.urgency === "emergency";
  const urgent = assessment.urgency === "urgent";
  return <div className="mx-auto max-w-3xl space-y-6"><header><p className={`text-[11px] font-bold uppercase tracking-[.15em] ${emergency ? "text-[var(--aera-critical)]" : urgent ? "text-[var(--aera-warning)]" : "text-[var(--aera-recovery-blue)]"}`}>Safety assessment {isDemo && "· preview"}</p><h1 className="mt-3 text-[34px] font-bold leading-tight tracking-[-.035em] sm:text-[46px]">{assessment.title}</h1></header><section className={`rounded-2xl border p-6 ${emergency ? "border-[var(--aera-critical)]/40 bg-red-50" : urgent ? "border-[var(--aera-warning)]/40 bg-amber-50" : "border-black/10 bg-white"}`}><p className="text-base leading-7">{assessment.summary}</p><p className="mt-4 text-lg font-bold leading-7">{assessment.escalation}</p>{emergency && <a href="tel:112" className="mt-5 flex min-h-13 items-center justify-center rounded-lg bg-[var(--aera-critical)] px-5 text-base font-bold text-white">Call 112 in the EU</a>}</section>{assessment.generalGuidance.length > 0 && <section className="rounded-2xl border border-black/10 bg-white p-6"><h2 className="text-lg font-bold">What to do now</h2><ul className="mt-4 space-y-3">{assessment.generalGuidance.map((item) => <li key={item} className="flex gap-3 text-sm leading-6"><Check size={17} className="mt-1 shrink-0 text-[var(--aera-forest)]" />{item}</li>)}</ul></section>}<section className="rounded-xl bg-[var(--aera-stone)] p-4 text-xs leading-5 text-black/60"><strong>Uncertainty:</strong> {assessment.uncertainty}<details className="mt-3"><summary className="cursor-pointer font-bold text-black">Safety basis and sources</summary><p className="mt-2">Rules: {assessment.rulesVersion} · {assessment.matchedRuleIds.length} matched escalation rule(s).</p><div className="mt-2 flex flex-col gap-1">{assessment.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="font-semibold underline">{source.label}</a>)}</div></details></section><button type="button" onClick={onReset} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-black/15 bg-white text-sm font-bold"><RotateCcw size={16} /> Start another assessment</button></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-xs font-bold text-black/50">{label}<span className="mt-1 block">{children}</span></label>; }
function YesNo({ label, value, onChange }: { label: string; value?: boolean; onChange: (value: boolean) => void }) { return <fieldset className="flex items-center justify-between gap-3 rounded-xl bg-[var(--aera-ivory)] p-3"><legend className="sr-only">{label}</legend><span className="text-sm font-semibold">{label}</span><span className="flex gap-1"><button type="button" onClick={() => onChange(true)} aria-pressed={value === true} className={`min-h-9 rounded-md px-3 text-xs font-bold ${value === true ? "bg-[var(--aera-ink)] text-white" : "bg-white"}`}>Yes</button><button type="button" onClick={() => onChange(false)} aria-pressed={value === false} className={`min-h-9 rounded-md px-3 text-xs font-bold ${value === false ? "bg-[var(--aera-ink)] text-white" : "bg-white"}`}>No</button></span></fieldset>; }

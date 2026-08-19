import Link from "next/link";

export const fieldClass = "min-h-[52px] w-full rounded-lg border border-black/15 bg-white px-4 py-[14px] text-base outline-none";
export const labelClass = "text-xs font-semibold uppercase tracking-[.1em] text-black/50";
export const optionClass = "flex min-h-[52px] cursor-pointer items-center gap-3 rounded-[10px] border border-black/12 bg-white px-5 py-[14px] text-base font-medium has-[:checked]:border-black has-[:checked]:bg-[var(--aera-ink)] has-[:checked]:text-white";

export function OnboardingFrame({
  step,
  title,
  description,
  backHref,
  action,
  submitLabel = "Continue",
  error,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  backHref: string;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="reference-stage">
      <div className="flex h-[844px] w-[390px] flex-none flex-col overflow-hidden rounded-[40px] border border-black/15 bg-[var(--aera-ivory)] shadow-[0_12px_32px_rgba(23,23,23,.08)] max-[453px]:rounded-none max-[453px]:border-0 max-[453px]:shadow-none">
        <div className="flex h-[46px] flex-none items-center justify-between px-[26px] text-[13px] font-semibold" aria-hidden="true"><span>9:41</span><span>ᯤ&nbsp;&nbsp;⏻</span></div>
        <form action={action} className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 pb-[26px] pt-1">
          <div className="flex items-center gap-3.5">
            <Link href={backHref} aria-label="Previous onboarding step" className="text-[22px] text-black/60">←</Link>
            <div className="h-[3px] flex-1 overflow-hidden rounded-sm bg-[var(--aera-stone)]"><div className="h-full rounded-sm bg-[var(--aera-ink)]" style={{ width: `${step * 10}%` }} /></div>
            <span className="text-[13px] font-semibold text-black/50">{step}/10</span>
          </div>
          <div>
            <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-.025em]">{title}</h1>
            {description ? <p className="mt-2 text-[15px] leading-[1.5] text-black/60">{description}</p> : null}
          </div>
          {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-[var(--aera-critical)]">{error}</p> : null}
          <div className="flex flex-col gap-4">{children}</div>
          <button className="mt-auto min-h-[52px] flex-none rounded-lg bg-[var(--aera-terracotta)] px-4 py-4 text-base font-semibold text-white" type="submit">{submitLabel}</button>
        </form>
      </div>
    </main>
  );
}

export function Choice({ type = "radio", name, value, children, required }: { type?: "radio" | "checkbox"; name: string; value: string; children: React.ReactNode; required?: boolean }) {
  return <label className={optionClass}><input className="size-4 accent-[var(--aera-terracotta)]" type={type} name={name} value={value} required={required} /><span>{children}</span></label>;
}

export function Field({ label, name, type = "text", required, min, max, step, placeholder }: { label: string; name: string; type?: string; required?: boolean; min?: number; max?: number; step?: number; placeholder?: string }) {
  return <label className="flex flex-col gap-2"><span className={labelClass}>{label}</span><input className={fieldClass} name={name} type={type} required={required} min={min} max={max} step={step} placeholder={placeholder} /></label>;
}

import Link from "next/link";

export default function Page() {
  return (
    <main className="reference-stage">
      <section className="flex h-[844px] w-[390px] flex-none flex-col overflow-hidden rounded-[40px] border border-black/15 bg-[var(--aera-forest)] px-6 pb-[26px] text-white shadow-[0_12px_32px_rgba(23,23,23,.08)] max-[453px]:rounded-none max-[453px]:border-0 max-[453px]:shadow-none">
        <div className="flex h-[46px] items-center justify-between px-0 text-[13px] font-semibold" aria-hidden="true"><span>9:41</span><span>ᯤ&nbsp;&nbsp;⏻</span></div>
        <p className="mt-3 text-xl font-bold tracking-[.16em]">AERA</p>
        <div className="mt-auto">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-white/60">Onboarding 1/10</p>
          <h1 className="mt-5 text-[38px] font-bold leading-[1.05] tracking-[-.03em]">Welcome to AERA.</h1>
          <p className="mt-4 max-w-[31ch] text-base leading-[1.55] text-white/75">Your personal AI coach for a stronger, healthier you.</p>
          <Link href="/onboarding/goal" className="mt-8 flex min-h-[52px] items-center justify-center rounded-lg bg-white text-base font-semibold text-[var(--aera-ink)]">Get Started</Link>
        </div>
      </section>
    </main>
  );
}

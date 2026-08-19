import Image from "next/image";
import { demoUser } from "@/lib/demo-data";
import { Eyebrow, PrimaryButton, SecondaryButton } from "@/components/ui";

export function MetricsStrip() {
  return (
    <section className="mt-8 grid overflow-hidden border-y border-black/35 sm:grid-cols-2 xl:grid-cols-5" aria-label="Today's metrics">
      {demoUser.metrics.map((metric, index) => (
        <div key={metric.label} className={`min-h-[136px] px-5 py-5 ${index ? "border-t border-black/20 sm:border-t-0 sm:border-l" : ""} border-black/20`}>
          <div className="text-[11px] font-semibold uppercase tracking-[.15em] text-black/45">{metric.label}</div>
          <div className="mt-2 text-[30px] font-black tracking-[-.035em]">{metric.value}</div>
          <div className={`mt-2 text-[13px] ${metric.tone === "positive" ? "text-[var(--aera-forest)]" : metric.tone === "recovery" ? "text-[var(--aera-recovery-blue)]" : "text-black/48"}`}>{metric.note}</div>
          {metric.progress ? <div className="mt-4 h-1.5 bg-black/10"><div className="h-full bg-[var(--aera-forest)]" style={{ width: `${metric.progress}%` }} /></div> : null}
        </div>
      ))}
    </section>
  );
}

export function InsightCard() {
  return (
    <section className="mt-8 rounded-xl border border-[var(--aera-terracotta)] bg-white p-6 sm:p-8">
      <Eyebrow>AERA Insight</Eyebrow>
      <p className="mt-4 max-w-4xl text-[18px] font-medium leading-7 sm:text-[20px]">Your weight is trending down while session volume holds steady. Recovery is 82% and soreness is moderate — keep today's upper-body session and hold the current calorie target.</p>
      <div className="mt-6"><PrimaryButton href="/coach">Ask AERA</PrimaryButton></div>
    </section>
  );
}

export function TodayPlan() {
  return (
    <section className="mt-9">
      <h2 className="text-[27px] font-black tracking-[-.035em]">Today's plan</h2>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="overflow-hidden rounded-xl bg-white shadow-[0_1px_0_rgba(23,23,23,.06)]">
          <div className="relative aspect-[16/7] overflow-hidden bg-[var(--aera-stone)]">
            <Image src={demoUser.plan.training.image} alt="Demo training session" fill className="object-cover" priority sizes="(max-width: 1280px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-5 text-white"><Eyebrow tone="terracotta">Training</Eyebrow><div className="mt-1 text-2xl font-black">{demoUser.plan.training.title}</div></div>
          </div>
          <div className="p-5">
            <p className="text-sm text-black/50">{demoUser.plan.training.duration} · {demoUser.plan.training.meta}</p>
            <div className="mt-5"><PrimaryButton href="/training">Start workout</PrimaryButton></div>
          </div>
        </article>

        <article className="rounded-xl bg-[var(--aera-stone)] p-6">
          <Eyebrow>Nutrition</Eyebrow>
          <div className="mt-4 text-[28px] font-black tracking-[-.03em]">{demoUser.plan.nutrition.calories} kcal · {demoUser.plan.nutrition.protein} g protein</div>
          <p className="mt-2 text-sm text-black/48">{demoUser.plan.nutrition.remainingCalories} kcal and {demoUser.plan.nutrition.remainingProtein} g protein left today</p>
          <div className="mt-8"><SecondaryButton href="/nutrition">View nutrition</SecondaryButton></div>
        </article>
      </div>
    </section>
  );
}

export function CheckInCard() {
  return (
    <section className="mt-8 border-t border-black/35 pt-7">
      <h2 className="text-[27px] font-black tracking-[-.035em]">How are you feeling today?</h2>
      <p className="mt-1 text-[15px] text-black/50">Seven quick answers, under 30 seconds. It changes today's recommendation.</p>
      <button className="mt-5 min-h-12 rounded-lg bg-[var(--aera-terracotta)] px-6 font-bold text-white">Start check-in</button>
    </section>
  );
}

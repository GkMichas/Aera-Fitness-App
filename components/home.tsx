import Image from "next/image";
import Link from "next/link";
import { demoUser } from "@/lib/demo-data";

const metricStyles = {
  positive: "text-[#2F6146]",
  recovery: "text-[#4E626B]",
  neutral: "text-black/50",
  warning: "text-[var(--aera-warning)]",
} as const;

export function HomeHeader() {
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <h1 className="max-w-[15ch] text-[30px] font-bold leading-[1.1] tracking-[-.025em] lg:max-w-none lg:text-[48px]">
          Good morning, George
        </h1>
        <p className="mt-1 text-[15px] text-black/60 lg:text-base">Here&apos;s your plan for today.</p>
      </div>
      <Link href="/you" aria-label="Open profile" className="grid size-[38px] flex-none place-items-center rounded-full bg-[var(--aera-stone)] text-sm font-semibold lg:hidden">
        G
      </Link>
    </header>
  );
}

export function MetricsGrid() {
  return (
    <section className="mt-[18px] grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-black/12 bg-black/12 lg:mt-8 lg:grid-cols-5" aria-label="Today’s metrics">
      {demoUser.metrics.map((metric, index) => (
        <article
          key={metric.label}
          className={`bg-white px-3 py-[14px] lg:min-h-32 lg:px-5 lg:py-5 ${index === 4 ? "col-span-2 lg:col-span-1" : ""}`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-black/50 lg:text-[11px]">{metric.label}</p>
          <p className="mt-[5px] text-[19px] font-bold tracking-[-.02em] lg:text-[27px]">{metric.value}</p>
          <p className={`mt-[5px] text-[11px] font-semibold lg:text-xs ${metricStyles[metric.tone ?? "neutral"]}`}>
            {metric.note}
          </p>
          {metric.progress ? (
            <div className="mt-2 h-1 overflow-hidden rounded-sm bg-[var(--aera-stone)]">
              <div className="h-full bg-[var(--aera-forest)]" style={{ width: `${metric.progress}%` }} />
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

export function InsightCard() {
  return (
    <section className="mt-[18px] rounded-[14px] bg-[var(--aera-forest)] p-5 text-white lg:mt-8 lg:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-white/60">AERA Insight</p>
      <p className="mt-[14px] max-w-3xl text-[16px] leading-6 lg:text-xl lg:leading-8">Weight is trending down and recovery is good — keep the planned upper-body session.</p>
      <Link href="/coach" className="mt-[14px] inline-flex min-h-11 items-center rounded-lg bg-white px-[18px] text-sm font-semibold text-[var(--aera-ink)]">
        Ask AERA
      </Link>
    </section>
  );
}

export function TodayPlan() {
  return (
    <section className="mt-[18px] grid gap-3 lg:mt-8 lg:grid-cols-2 lg:gap-5" aria-label="Today’s plan">
      <article className="flex overflow-hidden rounded-xl border border-black/12 bg-white">
        <div className="relative w-[104px] flex-none lg:w-[42%]">
          <Image src={demoUser.plan.training.image} alt="Upper-body training session" fill className="object-cover" sizes="(max-width: 1023px) 104px, 420px" priority />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4 lg:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--aera-forest)]">Training</p>
          <h2 className="text-[19px] font-bold tracking-[-.02em] lg:text-3xl">Upper Body</h2>
          <p className="text-[13px] text-black/60">45 min · 5 exercises</p>
          <Link href="/training/active" className="mt-0.5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--aera-terracotta)] px-4 text-sm font-semibold text-white lg:mt-4 lg:w-max">
            Start Workout
          </Link>
        </div>
      </article>

      <Link href="/nutrition" className="flex min-h-[112px] items-center justify-between gap-3 rounded-xl border border-black/12 bg-white p-4 lg:p-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#B24A34]">Nutrition</p>
          <h2 className="text-[19px] font-bold tracking-[-.02em] lg:text-3xl">1,180 kcal left</h2>
          <p className="text-[13px] text-black/60">Protein 88 / 170 g</p>
        </div>
        <span className="flex-none text-sm font-semibold text-[#B24A34]">View →</span>
      </Link>
    </section>
  );
}

export function HomeScreen() {
  return (
    <>
      <HomeHeader />
      <MetricsGrid />
      <InsightCard />
      <TodayPlan />
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Flame, TrendingUp } from "lucide-react";
import { demoWorkout } from "@/lib/training/demo";
import { getMuscleName } from "@/lib/training/catalog";
import { getMediaAsset } from "@/lib/media/catalog";

const week = [
  { day: "M", state: "done" }, { day: "T", state: "done" }, { day: "W", state: "rest" },
  { day: "T", state: "today" }, { day: "F", state: "rest" }, { day: "S", state: "rest" }, { day: "S", state: "rest" },
];

export function TrainingDashboard() {
  const hero = getMediaAsset("TRAINING_DUMBBELL_ROW");
  return (
    <div className="space-y-7">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-forest)]">Execute</p>
          <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">Training</h1>
        </div>
        <div className="flex items-center gap-4"><Link href="/training/program" className="text-sm font-bold text-[var(--aera-forest)]">Build plan</Link><Link href="/training/exercises" className="text-sm font-bold text-[var(--aera-terracotta)]">Exercise Library</Link></div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-xl border border-black/10 bg-white">
          <div className="relative h-48 overflow-hidden sm:h-64">{hero && <Image src={hero.src} alt={hero.alt} fill className="object-cover object-center" sizes="(max-width: 1279px) 100vw, 760px" priority />}</div>
          <div className="p-5 sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--aera-forest)]">Today · Day 3 of 4</p>
            <h2 className="mt-2 text-[28px] font-bold tracking-[-.025em]">{demoWorkout.name}</h2>
            <p className="mt-2 text-sm leading-6 text-black/55">{demoWorkout.durationMinutes} min · {demoWorkout.targetMuscleIds.map(getMuscleName).join(", ")} · Moderate</p>
            <Link href="/training/workout" className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-[var(--aera-terracotta)] px-5 text-base font-bold text-white transition hover:brightness-95">View workout <ArrowRight size={18} /></Link>
          </div>
        </section>

        <div className="space-y-5">
          <section>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.14em] text-black/45">This week</p>
            <div className="grid grid-cols-7 gap-1.5">
              {week.map((item, index) => <div key={`${item.day}-${index}`} className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg ${item.state === "done" ? "bg-[var(--aera-forest)] text-white" : item.state === "today" ? "bg-[var(--aera-ink)] text-white" : "bg-[var(--aera-stone)] text-black/45"}`}><span className="text-[10px] opacity-65">{item.day}</span>{item.state === "done" ? <Check size={15} /> : <span className="text-sm">{item.state === "today" ? "•" : "·"}</span>}</div>)}
            </div>
          </section>

          <section className="grid grid-cols-2 overflow-hidden rounded-xl border border-black/10 bg-black/10 gap-px">
            <Stat icon={<Flame size={17} />} label="Streak" value="6 weeks" note="4 sessions each" />
            <Stat icon={<TrendingUp size={17} />} label="Volume" value="+8%" note="vs last month" />
          </section>

          <section>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.14em] text-black/45">Recent</p>
            <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4">
              <div><p className="font-semibold">Lower Body</p><p className="mt-1 text-xs text-black/50">Tuesday · 48 min · felt moderate</p></div>
              <span className="rounded-md bg-[color-mix(in_srgb,var(--aera-success)_12%,transparent)] px-2.5 py-1.5 text-xs font-bold text-[var(--aera-success)]">Done</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <div className="bg-white p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-black/45">{icon}{label}</div><p className="mt-3 text-xl font-bold">{value}</p><p className="mt-1 text-xs text-black/50">{note}</p></div>;
}

import { Eyebrow, PageTitle } from "@/components/ui";

export default function YouPage() {
  return (
    <>
      <PageTitle title="You" subtitle="Your body, goals and history." />
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 md:col-span-2"><Eyebrow tone="forest">Your body</Eyebrow><div className="mt-4 text-5xl font-black tracking-[-.05em]">84.2 kg</div><p className="mt-2 text-[var(--aera-forest)]">↓ 2.4 kg since start</p><div className="mt-6 grid grid-cols-2 gap-4"><div><div className="text-xs uppercase tracking-[.14em] text-black/40">Waist</div><div className="mt-1 text-xl font-black">95.2 cm</div></div><div><div className="text-xs uppercase tracking-[.14em] text-black/40">Target</div><div className="mt-1 text-xl font-black">75 kg</div></div></div></div>
        <div className="rounded-2xl bg-[var(--aera-forest)] p-6 text-white"><Eyebrow>Goal</Eyebrow><div className="mt-4 text-2xl font-black">Lose fat</div><p className="mt-1 text-white/65">Secondary: build muscle</p><div className="mt-8 h-2 bg-white/20"><div className="h-full w-[42%] bg-[var(--aera-sand)]" /></div><p className="mt-2 text-xs text-white/60">42% to target</p></div>
      </section>
      <section className="mt-5 rounded-2xl bg-white p-6"><Eyebrow tone="forest">AERA Body Insight</Eyebrow><p className="mt-3 max-w-3xl text-lg leading-7">Weight is down while your training performance remains stable. That is the direction we want for a fat-loss phase focused on preserving muscle.</p></section>
    </>
  );
}

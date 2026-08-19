import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "@/components/ui";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--aera-ivory)]">
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-7 lg:px-12"><div className="text-2xl font-black tracking-[-.04em]">AERA</div><div className="flex gap-3"><SecondaryButton href="/login">Sign in</SecondaryButton><PrimaryButton href="/signup">Start</PrimaryButton></div></header>
      <section className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:px-12 lg:pt-16">
        <div className="flex flex-col justify-center"><div className="text-xs font-bold uppercase tracking-[.18em] text-[var(--aera-forest)]">Personal health intelligence</div><h1 className="mt-5 max-w-4xl text-[54px] font-black leading-[.92] tracking-[-.06em] sm:text-[74px] lg:text-[88px]">Understand your body. Become your best.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-black/55">One AI coach connecting your fitness, nutrition, recovery, body data and long-term progress.</p><div className="mt-8 flex flex-wrap gap-3"><PrimaryButton href="/signup">Start your journey</PrimaryButton><SecondaryButton href="/home">View demo</SecondaryButton></div></div>
        <div className="relative min-h-[520px] overflow-hidden rounded-[28px] bg-[var(--aera-stone)]"><Image src="/media/training-demo.jpg" alt="AERA training lifestyle demo" fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 45vw"/><div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"/><div className="absolute bottom-0 p-7 text-white"><div className="text-xs font-bold uppercase tracking-[.16em] text-[var(--aera-sand)]">One coach. Everything connected.</div><p className="mt-3 max-w-md text-xl font-semibold">AERA learns from what you do — then adapts what comes next.</p></div></div>
      </section>
    </main>
  );
}

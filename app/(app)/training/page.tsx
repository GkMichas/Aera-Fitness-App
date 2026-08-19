import Image from "next/image";
import { Eyebrow, PageTitle, PrimaryButton } from "@/components/ui";

const exercises = [
  ["Dumbbell Bench Press", "3 × 10", "Chest · Triceps"],
  ["Dumbbell Row", "3 × 12", "Back · Biceps"],
  ["Dumbbell Shoulder Press", "3 × 10", "Shoulders · Triceps"],
  ["Lateral Raise", "3 × 15", "Shoulders"],
  ["Biceps Curl", "3 × 12", "Biceps"],
];

export default function TrainingPage() {
  return (
    <>
      <PageTitle title="Training" subtitle="Today · Day 3 of 4" />
      <section className="mt-8 overflow-hidden rounded-2xl bg-white">
        <div className="relative aspect-[16/6] min-h-56"><Image src="/media/training-demo.jpg" alt="Demo upper body training" fill className="object-cover" sizes="100vw" /><div className="absolute inset-0 bg-black/35" /><div className="absolute inset-x-0 bottom-0 p-6 text-white"><Eyebrow>Today's workout</Eyebrow><h2 className="mt-2 text-4xl font-black">Upper Body</h2><p className="mt-2 text-white/80">45 min · Chest, shoulders, back, arms · Moderate</p></div></div>
        <div className="p-6"><PrimaryButton href="/training">Start workout</PrimaryButton></div>
      </section>
      <section className="mt-6 rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between"><h2 className="text-2xl font-black">Exercises</h2><button className="text-sm font-bold text-[var(--aera-forest)]">Library</button></div>
        <div className="mt-4 divide-y divide-black/10">{exercises.map(([name, sets, muscles], index) => <div key={name} className="grid grid-cols-[36px_1fr_auto] items-center gap-3 py-4"><span className="text-sm text-black/35">{index + 1}</span><div><div className="font-bold">{name}</div><div className="mt-1 text-sm text-black/45">{muscles}</div></div><div className="font-semibold">{sets}</div></div>)}</div>
      </section>
    </>
  );
}

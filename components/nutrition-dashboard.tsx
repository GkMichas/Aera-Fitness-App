import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { foodCatalog } from "@/lib/nutrition/catalog";
import { calculateMeal } from "@/lib/nutrition/calculations";
import { demoMeals } from "@/lib/nutrition/demo";
import { getMediaAsset } from "@/lib/media/catalog";

const target = { calories: 2240, proteinG: 170, carbsG: 220, fatG: 72 };

export function NutritionDashboard() {
  const meals = demoMeals.map((meal) => ({ ...meal, calculated: calculateMeal(meal.items, foodCatalog) }));
  const consumed = meals.reduce((sum, meal) => ({ calories: sum.calories + meal.calculated.totals.calories, proteinG: sum.proteinG + meal.calculated.totals.proteinG, carbsG: sum.carbsG + meal.calculated.totals.carbsG, fatG: sum.fatG + meal.calculated.totals.fatG }), { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 });
  return <div className="space-y-7">
    <header className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-terracotta)]">Today</p><h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">Nutrition</h1></div><Link href="/nutrition/log" className="flex min-h-11 items-center gap-2 rounded-lg bg-[var(--aera-terracotta)] px-4 text-sm font-bold text-white"><Plus size={17} /> Log meal</Link></header>
    <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-2xl bg-[var(--aera-forest)] p-6 text-white sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-white/55">Calories remaining</p><p className="mt-3 text-[48px] font-bold leading-none tracking-[-.05em]">{Math.max(0, target.calories - consumed.calories).toLocaleString()}</p><p className="mt-2 text-sm text-white/55">{consumed.calories.toLocaleString()} of {target.calories.toLocaleString()} kcal consumed</p><div className="mt-7 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[var(--aera-terracotta)]" style={{ width: `${Math.min(100, consumed.calories / target.calories * 100)}%` }} /></div></div>
      <div className="space-y-4 rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><Macro label="Protein" value={consumed.proteinG} target={target.proteinG} color="var(--aera-forest)" /><Macro label="Carbs" value={consumed.carbsG} target={target.carbsG} color="var(--aera-sand)" /><Macro label="Fat" value={consumed.fatG} target={target.fatG} color="var(--aera-sage)" /></div>
    </section>
    <section><div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-black/45">Today&apos;s meals</p><Link href="/nutrition/foods" className="text-sm font-bold text-[var(--aera-terracotta)]">Search foods</Link></div><div className="mt-3 grid gap-4 lg:grid-cols-2">{meals.map((meal, index) => {
      const recipeId = index === 0 ? "greek-yogurt-bowl" : "chicken-pita";
      const media = getMediaAsset(index === 0 ? "NUTRITION_BREAKFAST_01" : "NUTRITION_LUNCH_01");
      return <Link key={meal.id} href={`/nutrition/meal/${recipeId}`} className="group flex min-h-36 overflow-hidden rounded-xl border border-black/10 bg-white"><div className="relative w-32 shrink-0 bg-[var(--aera-stone)]">{media && <Image src={media.src} alt="" fill className="object-cover transition duration-300 group-hover:scale-[1.02]" sizes="128px" />}</div><div className="flex min-w-0 flex-1 flex-col p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--aera-terracotta)]">{meal.type}</p><h2 className="mt-1 text-lg font-bold">{meal.name}</h2><p className="mt-2 text-xs leading-5 text-black/50">{meal.calculated.totals.calories} kcal · {meal.calculated.totals.proteinG} g protein · {meal.calculated.totals.carbsG} g carbs</p><span className="mt-auto flex items-center gap-1 text-xs font-bold text-[var(--aera-terracotta)]">View meal <ArrowRight size={14} /></span></div></Link>;
    })}</div></section>
    <p className="text-xs leading-5 text-black/45">Nutrition values are estimates calculated from the confirmed portion weights in the food catalog.</p>
  </div>;
}

function Macro({ label, value, target, color }: { label: string; value: number; target: number; color: string }) { const progress = Math.min(100, value / target * 100); return <div><div className="flex justify-between text-sm"><span className="font-semibold">{label}</span><span className="text-black/50">{value.toFixed(1)} / {target} g</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--aera-stone)]"><div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: color }} /></div></div>; }

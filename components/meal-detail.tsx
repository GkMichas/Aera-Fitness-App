import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, RefreshCw } from "lucide-react";
import { calculateMeal } from "@/lib/nutrition/calculations";
import { foodCatalog, getFood } from "@/lib/nutrition/catalog";
import type { Recipe } from "@/types/nutrition";
import { getMediaAsset } from "@/lib/media/catalog";

export function MealDetail({ recipe }: { recipe: Recipe }) {
  const calculated = calculateMeal(recipe.items, foodCatalog);
  const media = getMediaAsset(recipe.mediaId);
  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link href="/nutrition" className="inline-flex items-center gap-2 text-sm font-bold text-black/55"><ArrowLeft size={16} /> Nutrition</Link>
      <div className="grid overflow-hidden rounded-2xl border border-black/10 bg-white lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative min-h-72 bg-[var(--aera-stone)]">{media && <Image src={media.src} alt={media.alt} fill className="object-cover" sizes="(max-width: 1023px) 100vw, 420px" priority />}</div>
        <div className="p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-terracotta)]">Meal recipe</p>
          <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-[-.035em]">{recipe.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-black/50"><Clock size={16} /> {recipe.prepMinutes} min · {recipe.servings} serving</p>
          <div className="mt-7 grid grid-cols-4 gap-2 border-y border-black/8 py-5 text-center">
            <Metric label="kcal" value={calculated.totals.calories} />
            <Metric label="protein" value={`${calculated.totals.proteinG}g`} />
            <Metric label="carbs" value={`${calculated.totals.carbsG}g`} />
            <Metric label="fat" value={`${calculated.totals.fatG}g`} />
          </div>
          <Link href="/nutrition/log" className="mt-7 flex min-h-12 items-center justify-center rounded-lg bg-[var(--aera-terracotta)] px-5 text-sm font-bold text-white">Use this meal</Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold">Ingredients</h2>
          <div className="mt-4 divide-y divide-black/8">
            {recipe.items.map((item) => {
              const food = getFood(item.foodId);
              return food && <div key={item.foodId} className="flex justify-between gap-4 py-3 text-sm"><span>{food.name}</span><span className="font-bold">{item.grams} g</span></div>;
            })}
          </div>
          {recipe.substitutions.length > 0 && <div className="mt-5 rounded-lg bg-[var(--aera-stone)] p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.08em] text-black/45"><RefreshCw size={14} /> Substitution</p>{recipe.substitutions.map((item) => <p key={item.foodId} className="mt-2 text-sm">Swap {getFood(item.foodId)?.name} for {getFood(item.substituteFoodId)?.name}.</p>)}</div>}
        </section>
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold">Preparation</h2>
          <ol className="mt-4 space-y-4">{recipe.instructions.map((instruction, index) => <li key={instruction} className="flex gap-3 text-sm leading-6"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--aera-forest)] text-xs font-bold text-white">{index + 1}</span><span>{instruction}</span></li>)}</ol>
        </section>
      </div>
      <p className="text-xs leading-5 text-black/45">Nutrition values are estimates based on catalog values and confirmed edible weights.</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div><p className="text-sm font-bold">{value}</p><p className="mt-1 text-[9px] uppercase tracking-[.08em] text-black/40">{label}</p></div>;
}

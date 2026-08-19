import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { calculateMeal } from "@/lib/nutrition/calculations";
import { foodCatalog, getFood } from "@/lib/nutrition/catalog";
import { demoRecipes } from "@/lib/nutrition/demo";
import { getMediaAsset } from "@/lib/media/catalog";

export function MealPlan() {
  const planned = demoRecipes.map((recipe) => ({ recipe, nutrition: calculateMeal(recipe.items, foodCatalog) }));
  const calories = planned.reduce((sum, item) => sum + item.nutrition.totals.calories, 0);
  const protein = planned.reduce((sum, item) => sum + item.nutrition.totals.proteinG, 0);
  const shoppingItems = Array.from(new Map(demoRecipes.flatMap((recipe) => recipe.items).map((item) => [item.foodId, getFood(item.foodId)?.name])).values()).filter(Boolean);
  return (
    <div className="space-y-7">
      <header><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-terracotta)]">Your nutrition plan</p><h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">Simple meals, clear targets</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">A starter day built from your catalog. Personal preferences and targets will replace this preview after onboarding sync.</p></header>
      <section className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-[var(--aera-forest)] p-6 text-white"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/55">Planned energy</p><p className="mt-2 text-4xl font-bold">{calories} <span className="text-base text-white/55">kcal</span></p></div><div className="rounded-2xl border border-black/10 bg-white p-6"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-black/40">Planned protein</p><p className="mt-2 text-4xl font-bold">{protein.toFixed(1)} <span className="text-base text-black/45">g</span></p></div></section>
      <section><h2 className="text-xl font-bold">Meals</h2><div className="mt-4 grid gap-4 lg:grid-cols-2">{planned.map(({ recipe, nutrition }) => {
        const media = getMediaAsset(recipe.mediaId);
        return <Link key={recipe.id} href={`/nutrition/meal/${recipe.id}`} className="group overflow-hidden rounded-2xl border border-black/10 bg-white"><div className="relative aspect-[16/8] bg-[var(--aera-stone)]">{media && <Image src={media.src} alt="" fill className="object-cover transition duration-300 group-hover:scale-[1.02]" sizes="(max-width: 1023px) 100vw, 50vw" />}</div><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--aera-terracotta)]">{recipe.prepMinutes} min</p><h3 className="mt-2 text-lg font-bold">{recipe.name}</h3><p className="mt-2 text-sm text-black/50">{nutrition.totals.calories} kcal · {nutrition.totals.proteinG}g protein</p><span className="mt-5 flex items-center gap-1 text-xs font-bold text-[var(--aera-terracotta)]">View recipe <ArrowRight size={14} /></span></div></Link>;
      })}</div></section>
      <section className="rounded-2xl border border-black/10 bg-white p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><ShoppingBasket size={20} /> Shopping list</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{shoppingItems.map((name) => <label key={name} className="flex items-center gap-3 rounded-lg bg-[var(--aera-stone)] p-3 text-sm"><input type="checkbox" className="size-4 accent-[var(--aera-terracotta)]" /> {name}</label>)}</div></section>
      <p className="text-xs leading-5 text-black/45">This starter plan is a preview. Nutrition values are estimates and can vary by product and preparation.</p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { calculateMacrosForGrams } from "@/lib/nutrition/calculations";
import { foodCatalog } from "@/lib/nutrition/catalog";

export function FoodSearch() {
  const [query, setQuery] = useState("");
  const [grams, setGrams] = useState<Record<string, number>>({});
  const foods = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return foodCatalog.foods;
    return foodCatalog.foods.filter((food) =>
      [food.name, food.category, ...food.aliases, ...food.dietaryTags]
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [query]);

  return (
    <div className="space-y-7">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-terracotta)]">Food catalog</p>
        <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">Find a food</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">Search the English catalog and adjust the edible portion to see an instant nutrition estimate.</p>
      </header>

      <label className="flex min-h-14 items-center gap-3 rounded-xl border border-black/10 bg-white px-4 focus-within:border-[var(--aera-terracotta)]">
        <Search size={19} className="text-black/35" aria-hidden="true" />
        <span className="sr-only">Search foods</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-base outline-none" placeholder="Search chicken, oats, fruit…" />
      </label>

      <p className="text-xs font-semibold text-black/45">{foods.length} {foods.length === 1 ? "result" : "results"}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {foods.map((food) => {
          const portionGrams = grams[food.id] ?? food.servings[0].grams;
          const macros = calculateMacrosForGrams(food.nutrientsPer100g, portionGrams);
          return (
            <article key={food.id} className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--aera-terracotta)]">{food.category}</p>
                  <h2 className="mt-1 text-lg font-bold">{food.name}</h2>
                  <p className="mt-1 text-xs text-black/45">Default: {food.servings[0].label}</p>
                </div>
                <label className="text-right text-xs font-bold text-black/50">
                  Portion
                  <span className="mt-1 flex items-center rounded-lg bg-[var(--aera-stone)] px-3 py-2">
                    <input
                      aria-label={`${food.name} portion in grams`}
                      type="number"
                      min="1"
                      max="2000"
                      step="1"
                      value={portionGrams}
                      onChange={(event) => setGrams((current) => ({ ...current, [food.id]: Math.max(1, Number(event.target.value) || 1) }))}
                      className="w-14 bg-transparent text-right text-sm font-bold text-black outline-none"
                    />
                    <span className="ml-1">g</span>
                  </span>
                </label>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2 border-t border-black/8 pt-4 text-center">
                <Metric label="kcal" value={macros.calories} />
                <Metric label="protein" value={`${macros.proteinG}g`} />
                <Metric label="carbs" value={`${macros.carbsG}g`} />
                <Metric label="fat" value={`${macros.fatG}g`} />
              </div>
              {food.allergens.length > 0 && <p className="mt-4 text-xs text-black/45">Contains: {food.allergens.join(", ")}</p>}
            </article>
          );
        })}
      </div>
      {foods.length === 0 && <div className="rounded-2xl border border-dashed border-black/15 p-8 text-center text-sm text-black/50">No matching foods yet.</div>}
      <p className="text-xs leading-5 text-black/45">Values are estimates for the selected portion and may vary by product and preparation method.</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div><p className="text-sm font-bold">{value}</p><p className="mt-1 text-[9px] uppercase tracking-[.08em] text-black/40">{label}</p></div>;
}

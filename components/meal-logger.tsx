"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { calculateMeal } from "@/lib/nutrition/calculations";
import { foodCatalog, getFood } from "@/lib/nutrition/catalog";
import { parseMealText } from "@/lib/nutrition/text-parser";
import type { ParsedMealDraft } from "@/types/nutrition";
import { updateLocalData } from "@/lib/local-data";

const example = "2 eggs, one pita and Greek yogurt";

export function MealLogger() {
  const [text, setText] = useState(example);
  const [draft, setDraft] = useState<ParsedMealDraft | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const calculated = useMemo(() => draft ? calculateMeal(draft.items, foodCatalog) : null, [draft]);

  function interpret() {
    setDraft(parseMealText(text, foodCatalog));
    setConfirmed(false);
  }

  function updateGrams(index: number, grams: number) {
    setDraft((current) => current ? {
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, grams: Math.max(1, grams || 1) } : item),
    } : current);
    setConfirmed(false);
  }

  function confirmMeal() {
    if (!draft || !calculated) return;
    updateLocalData((current) => ({ ...current, meals: [...current.meals, { id: crypto.randomUUID(), recordedAt: new Date().toISOString(), sourceText: text.trim(), items: draft.items, macros: calculated.totals }] }));
    setConfirmed(true);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <header>
        <Link href="/nutrition" className="inline-flex items-center gap-2 text-sm font-bold text-black/55"><ArrowLeft size={16} /> Nutrition</Link>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[.15em] text-[var(--aera-terracotta)]">Quick log</p>
        <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-.035em] sm:text-[46px]">What did you eat?</h1>
        <p className="mt-3 text-sm leading-6 text-black/55">Describe your meal naturally. AERA creates an editable estimate that you review before confirming.</p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <label htmlFor="meal-text" className="text-xs font-bold uppercase tracking-[.1em] text-black/45">Meal description</label>
        <textarea id="meal-text" value={text} onChange={(event) => { setText(event.target.value); setConfirmed(false); }} rows={4} className="mt-3 w-full resize-none rounded-xl bg-[var(--aera-stone)] p-4 text-base leading-7 outline-none focus:ring-2 focus:ring-[var(--aera-terracotta)]/30" placeholder={example} />
        <button type="button" onClick={interpret} disabled={!text.trim()} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--aera-forest)] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><Sparkles size={17} /> Interpret meal</button>
      </section>

      {draft && calculated && (
        <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--aera-terracotta)]">Review estimate</p><h2 className="mt-1 text-xl font-bold">Confirm every portion</h2></div><p className="rounded-full bg-[var(--aera-stone)] px-3 py-1 text-xs font-bold">{calculated.totals.calories} kcal</p></div>
          <div className="mt-5 divide-y divide-black/8 border-y border-black/8">
            {draft.items.map((item, index) => {
              const food = getFood(item.foodId);
              const macros = calculated.items[index].macros;
              if (!food) return null;
              return <div key={`${item.foodId}-${index}`} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate text-sm font-bold">{food.name}</p><p className="mt-1 text-xs text-black/45">{macros.calories} kcal · {macros.proteinG}g protein</p></div><label className="flex shrink-0 items-center rounded-lg bg-[var(--aera-stone)] px-3 py-2 text-xs font-bold"><span className="sr-only">{food.name} grams</span><input type="number" min="1" max="2000" value={item.grams} onChange={(event) => updateGrams(index, Number(event.target.value))} className="w-14 bg-transparent text-right text-sm font-bold outline-none" /><span className="ml-1 text-black/50">g</span></label></div>;
            })}
          </div>
          {draft.unparsed.length > 0 && <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900"><strong>Needs attention:</strong> We could not match {draft.unparsed.join(", ")}. Search the food catalog or revise your description.</div>}
          <div className="mt-5 grid grid-cols-3 gap-3 text-center"><Metric label="Protein" value={`${calculated.totals.proteinG}g`} /><Metric label="Carbs" value={`${calculated.totals.carbsG}g`} /><Metric label="Fat" value={`${calculated.totals.fatG}g`} /></div>
          <button type="button" disabled={draft.items.length === 0 || draft.unparsed.length > 0} onClick={confirmMeal} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--aera-terracotta)] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><Check size={17} /> Confirm meal</button>
          {confirmed && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-900">Meal saved on this device.</p>}
          <p className="mt-4 text-xs leading-5 text-black/45">This is an estimate, not a laboratory measurement. In local mode it stays on this device; a connected account uses private cloud storage.</p>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[var(--aera-stone)] p-3"><p className="font-bold">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[.08em] text-black/40">{label}</p></div>;
}

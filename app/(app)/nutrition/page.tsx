import { Eyebrow, PageTitle } from "@/components/ui";

const meals = [
  ["Breakfast", "Greek yogurt, berries & honey", "390 kcal · 31g protein"],
  ["Lunch", "Chicken Mediterranean bowl", "610 kcal · 58g protein"],
  ["Snack", "Banana & yogurt", "230 kcal · 18g protein"],
];

export default function NutritionPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4"><PageTitle title="Nutrition" subtitle="Today's targets and meals." /><button className="min-h-11 rounded-lg bg-[var(--aera-terracotta)] px-5 font-bold text-white">Log meal</button></div>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Calories","1,370 / 2,190"],["Protein","112 / 168 g"],["Carbs","138 / 210 g"],["Fat","48 / 65 g"]].map(([k,v]) => <div key={k} className="rounded-xl bg-white p-5"><Eyebrow tone="forest">{k}</Eyebrow><div className="mt-2 text-2xl font-black">{v}</div></div>)}
      </section>
      <section className="mt-7 rounded-2xl bg-white p-6"><h2 className="text-2xl font-black">Today's meals</h2><div className="mt-4 divide-y divide-black/10">{meals.map(([type,name,macro]) => <div key={type} className="py-4"><div className="text-xs font-bold uppercase tracking-[.14em] text-[var(--aera-terracotta)]">{type}</div><div className="mt-1 font-bold">{name}</div><div className="mt-1 text-sm text-black/45">{macro}</div></div>)}</div></section>
    </>
  );
}

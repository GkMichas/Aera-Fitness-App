import type { CalculatedMeal, FoodCatalog, Macros, MealItem } from "@/types/nutrition";

const zero = (): Macros => ({ calories: 0, proteinG: 0, carbsG: 0, fatG: 0 });
const round = (value: number, digits = 1) => Number(value.toFixed(digits));

export function calculateMacrosForGrams(per100g: Macros, grams: number): Macros {
  if (!Number.isFinite(grams) || grams < 0) throw new Error("grams must be a non-negative finite number");
  const factor = grams / 100;
  return { calories: round(per100g.calories * factor, 0), proteinG: round(per100g.proteinG * factor), carbsG: round(per100g.carbsG * factor), fatG: round(per100g.fatG * factor) };
}

export function calculateMeal(items: MealItem[], catalog: FoodCatalog): CalculatedMeal {
  const foods = new Map(catalog.foods.map((food) => [food.id, food]));
  const calculatedItems = items.map((item) => { const food = foods.get(item.foodId); if (!food) throw new Error(`Unknown food ID: ${item.foodId}`); return { ...item, macros: calculateMacrosForGrams(food.nutrientsPer100g, item.grams) }; });
  const totals = calculatedItems.reduce((sum, item) => ({ calories: sum.calories + item.macros.calories, proteinG: sum.proteinG + item.macros.proteinG, carbsG: sum.carbsG + item.macros.carbsG, fatG: sum.fatG + item.macros.fatG }), zero());
  return { items: calculatedItems, totals: { calories: round(totals.calories, 0), proteinG: round(totals.proteinG), carbsG: round(totals.carbsG), fatG: round(totals.fatG) } };
}

export function calorieEstimateFromMacros(macros: Omit<Macros, "calories">) { return round(macros.proteinG * 4 + macros.carbsG * 4 + macros.fatG * 9, 0); }

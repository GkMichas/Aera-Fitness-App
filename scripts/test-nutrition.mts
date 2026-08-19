import assert from "node:assert/strict";
import catalogJson from "../data/nutrition/foods.v1.json" with { type: "json" };
import { calculateMacrosForGrams, calculateMeal } from "../lib/nutrition/calculations.ts";
import { parseMealText } from "../lib/nutrition/text-parser.ts";
import type { FoodCatalog } from "../types/nutrition.ts";

const catalog = catalogJson as FoodCatalog;

assert.deepEqual(calculateMacrosForGrams({ calories: 200, proteinG: 10, carbsG: 20, fatG: 5 }, 150), { calories: 300, proteinG: 15, carbsG: 30, fatG: 7.5 });
assert.throws(() => calculateMacrosForGrams({ calories: 1, proteinG: 1, carbsG: 1, fatG: 1 }, -1));

const meal = calculateMeal([{ foodId: "food_egg_whole", grams: 100 }, { foodId: "food_pita_wholewheat", grams: 60 }], catalog);
assert.equal(meal.totals.calories, 312);
assert.equal(meal.totals.proteinG, 18.5);

const parsed = parseMealText("2 eggs, one pita and Greek yogurt", catalog);
assert.equal(parsed.requiresConfirmation, true);
assert.equal(parsed.items.length, 3);
assert.equal(parsed.items[0].grams, 100);
assert.equal(parsed.items[1].grams, 60);
assert.equal(parsed.items[2].grams, 200);
assert.deepEqual(parsed.unparsed, []);

const incomplete = parseMealText("one egg and mystery sauce", catalog);
assert.deepEqual(incomplete.unparsed, ["mystery sauce"]);

console.log("Nutrition calculations and parser tests passed.");

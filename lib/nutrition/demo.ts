import type { Meal, Recipe } from "@/types/nutrition";

export const demoMeals: Meal[] = [
  { id: "meal_breakfast", name: "Greek Yogurt Bowl", type: "breakfast", items: [{ foodId: "food_greek_yogurt", grams: 200 }, { foodId: "food_oats", grams: 40 }, { foodId: "food_banana", grams: 100 }, { foodId: "food_almonds", grams: 15 }] },
  { id: "meal_lunch", name: "Chicken Pita", type: "lunch", items: [{ foodId: "food_chicken_breast", grams: 150 }, { foodId: "food_pita_wholewheat", grams: 60 }, { foodId: "food_tomato", grams: 100 }, { foodId: "food_greek_yogurt", grams: 50 }, { foodId: "food_olive_oil", grams: 5 }] },
];

export const demoRecipes: Recipe[] = [
  { id: "chicken-pita", name: "Chicken Pita with Yogurt", prepMinutes: 20, servings: 1, items: demoMeals[1].items, instructions: ["Warm the pita and slice the cooked chicken.", "Add tomato and chicken to the pita.", "Finish with yogurt and olive oil."], substitutions: [{ foodId: "food_chicken_breast", substituteFoodId: "food_tuna_canned" }], mediaId: "NUTRITION_LUNCH_01" },
  { id: "greek-yogurt-bowl", name: "Greek Yogurt Bowl", prepMinutes: 5, servings: 1, items: demoMeals[0].items, instructions: ["Add yogurt to a bowl.", "Top with oats, sliced banana and almonds."], substitutions: [{ foodId: "food_almonds", substituteFoodId: "food_avocado" }], mediaId: "NUTRITION_BREAKFAST_01" },
];

export function getRecipe(id: string) { return demoRecipes.find((recipe) => recipe.id === id); }

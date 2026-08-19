import type { Food, Macros, Meal, ParsedMealDraft } from "@/types/nutrition";

export interface NutritionTarget {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface ConfirmMealInput {
  name: string;
  type: Meal["type"];
  items: Meal["items"];
  sourceText?: string;
}

export interface NutritionRepository {
  getTarget(userId: string): Promise<NutritionTarget | null>;
  searchFoods(query: string): Promise<Food[]>;
  getMealsForDate(userId: string, date: string): Promise<Meal[]>;
  saveParseDraft(userId: string, sourceText: string, draft: ParsedMealDraft): Promise<string>;
  confirmMeal(userId: string, input: ConfirmMealInput): Promise<Meal>;
  calculateDayTotals(userId: string, date: string): Promise<Macros>;
}

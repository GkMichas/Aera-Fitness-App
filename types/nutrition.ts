export interface Macros { calories: number; proteinG: number; carbsG: number; fatG: number; }
export interface FoodServing { id: string; label: string; grams: number; }
export interface Food {
  id: string; name: string; aliases: string[]; category: "protein" | "dairy" | "grain" | "fruit" | "vegetable" | "fat" | "legume";
  nutrientsPer100g: Macros; servings: FoodServing[]; allergens: string[]; dietaryTags: string[];
  source: string; sourceUrl: string;
}
export interface FoodCatalog { schemaVersion: 1; foods: Food[]; }
export interface MealItem { foodId: string; grams: number; servingId?: string; quantity?: number; }
export interface Meal { id: string; name: string; type: "breakfast" | "lunch" | "dinner" | "snack"; items: MealItem[]; loggedAt?: string; }
export interface Recipe { id: string; name: string; prepMinutes: number; servings: number; items: MealItem[]; instructions: string[]; substitutions: { foodId: string; substituteFoodId: string }[]; mediaId: string; }
export interface CalculatedMealItem extends MealItem { macros: Macros; }
export interface CalculatedMeal { items: CalculatedMealItem[]; totals: Macros; }
export interface ParsedMealItem { foodId: string; matchedText: string; grams: number; confidence: "high" | "medium"; }
export interface ParsedMealDraft { items: ParsedMealItem[]; unparsed: string[]; requiresConfirmation: true; }

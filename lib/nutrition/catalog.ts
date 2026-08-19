import catalogJson from "@/data/nutrition/foods.v1.json";
import type { FoodCatalog } from "@/types/nutrition";

export const foodCatalog = catalogJson as FoodCatalog;
const byId = new Map(foodCatalog.foods.map((food) => [food.id, food]));
export function getFood(id: string) { return byId.get(id); }
export function searchFoods(query: string) { const value = query.trim().toLowerCase(); return !value ? foodCatalog.foods : foodCatalog.foods.filter((food) => [food.name, ...food.aliases, food.category, ...food.dietaryTags].join(" ").toLowerCase().includes(value)); }

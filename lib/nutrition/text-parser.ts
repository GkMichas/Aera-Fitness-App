import type { FoodCatalog, ParsedMealDraft } from "@/types/nutrition";

const numbers: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5 };

export function parseMealText(text: string, catalog: FoodCatalog): ParsedMealDraft {
  const segments = text.toLowerCase().split(/,|\band\b/).map((item) => item.trim()).filter(Boolean);
  const items: ParsedMealDraft["items"] = [];
  const unparsed: string[] = [];
  for (const segment of segments) {
    const food = catalog.foods.find((candidate) => candidate.aliases.some((alias) => segment.includes(alias)) || segment.includes(candidate.name.toLowerCase()));
    if (!food) { unparsed.push(segment); continue; }
    const gramsMatch = segment.match(/(\d+(?:\.\d+)?)\s*g\b/);
    const countMatch = segment.match(/\b(\d+(?:\.\d+)?|a|an|one|two|three|four|five)\b/);
    const count = countMatch ? (numbers[countMatch[1]] ?? Number(countMatch[1])) : 1;
    const serving = food.servings[0];
    const grams = gramsMatch ? Number(gramsMatch[1]) : serving.grams * count;
    items.push({ foodId: food.id, matchedText: segment, grams, confidence: gramsMatch || countMatch ? "high" : "medium" });
  }
  return { items, unparsed, requiresConfirmation: true };
}

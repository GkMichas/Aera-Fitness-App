import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/nutrition/foods.v1.json", import.meta.url), "utf8"));
const errors = [];
const ids = new Set();
const greek = /[\u0370-\u03ff\u1f00-\u1fff]/u;

if (catalog.schemaVersion !== 1) errors.push("schemaVersion must be 1");
if (!Array.isArray(catalog.foods) || catalog.foods.length === 0) errors.push("foods must be a non-empty array");

for (const food of catalog.foods ?? []) {
  if (!food.id || ids.has(food.id)) errors.push(`duplicate or missing food id: ${food.id}`);
  ids.add(food.id);
  if (!food.name || greek.test(JSON.stringify(food))) errors.push(`${food.id}: values must be English-only`);
  for (const key of ["calories", "proteinG", "carbsG", "fatG"]) {
    const value = food.nutrientsPer100g?.[key];
    if (!Number.isFinite(value) || value < 0) errors.push(`${food.id}: invalid ${key}`);
  }
  if (!Array.isArray(food.servings) || food.servings.some((serving) => !serving.label || !Number.isFinite(serving.grams) || serving.grams <= 0)) errors.push(`${food.id}: invalid serving`);
  if (!food.source || !food.sourceUrl?.startsWith("https://")) errors.push(`${food.id}: source metadata required`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Nutrition catalog valid: ${catalog.foods.length} English foods.`);

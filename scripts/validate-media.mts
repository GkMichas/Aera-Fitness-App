import { access, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { aeraMediaAssets } from "../lib/media/catalog.ts";

const catalog = JSON.parse(await readFile(new URL("../data/training/catalog.v1.json", import.meta.url), "utf8"));
const requiredIds = new Set<string>([
  ...catalog.exercises.map((exercise: { mediaId: string }) => exercise.mediaId),
  "NUTRITION_BREAKFAST_01",
  "NUTRITION_LUNCH_01",
  "PROGRESS_DEMO_FRONT",
  "PROGRESS_DEMO_SIDE",
]);
const errors: string[] = [];

for (const id of requiredIds) {
  const asset = aeraMediaAssets[id];
  if (!asset) {
    errors.push(`${id}: missing named media registry entry`);
    continue;
  }
  const file = new URL(`../public${asset.src}`, import.meta.url);
  try {
    await access(file);
    const info = await stat(fileURLToPath(file));
    if (info.size > 750_000) errors.push(`${id}: source asset exceeds 750 KB (${info.size} bytes)`);
  } catch {
    errors.push(`${id}: missing project file ${asset.src}`);
  }
}

if (errors.length) {
  console.error(`Media validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Media valid: ${requiredIds.size} named assets cover every curated exercise plus nutrition and progress demo media.`);

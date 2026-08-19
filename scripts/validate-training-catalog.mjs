import { readFile } from "node:fs/promises";

const catalogPath = new URL("../data/training/catalog.v1.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const homeGymPath = new URL("../data/training/home-gym-database.v1.json", import.meta.url);
const homeGym = JSON.parse(await readFile(homeGymPath, "utf8"));
const errors = [];
const greekCharacters = /[\u0370-\u03ff\u1f00-\u1fff]/u;

function ids(items, label) {
  const values = new Set();
  for (const item of items) {
    if (!item.id) errors.push(`${label}: missing id`);
    if (values.has(item.id)) errors.push(`${label}: duplicate id ${item.id}`);
    values.add(item.id);
  }
  return values;
}

if (catalog.schemaVersion !== 1) errors.push("schemaVersion must be 1");
const equipmentIds = ids(catalog.equipment ?? [], "equipment");
const muscleIds = ids(catalog.muscles ?? [], "muscle");
const patternIds = ids(catalog.movementPatterns ?? [], "movement pattern");
const exerciseIds = ids(catalog.exercises ?? [], "exercise");
const slugs = new Set();

for (const exercise of catalog.exercises ?? []) {
  if (slugs.has(exercise.slug)) errors.push(`exercise: duplicate slug ${exercise.slug}`);
  slugs.add(exercise.slug);
  if (!exercise.mediaId) errors.push(`${exercise.id}: missing mediaId`);
  if (!exercise.instructions?.length) errors.push(`${exercise.id}: missing instructions`);
  if (!exercise.coachingCues?.length) errors.push(`${exercise.id}: missing coaching cues`);
  if (!Array.isArray(exercise.cautionTags)) errors.push(`${exercise.id}: cautionTags must be an array`);
  if (!patternIds.has(exercise.movementPatternId)) errors.push(`${exercise.id}: unknown movement pattern ${exercise.movementPatternId}`);
  for (const id of exercise.equipmentIds ?? []) if (!equipmentIds.has(id)) errors.push(`${exercise.id}: unknown equipment ${id}`);
  for (const id of [...(exercise.primaryMuscleIds ?? []), ...(exercise.secondaryMuscleIds ?? [])]) if (!muscleIds.has(id)) errors.push(`${exercise.id}: unknown muscle ${id}`);
  for (const relation of exercise.relations ?? []) {
    if (!exerciseIds.has(relation.exerciseId)) errors.push(`${exercise.id}: unknown related exercise ${relation.exerciseId}`);
    if (relation.exerciseId === exercise.id) errors.push(`${exercise.id}: cannot relate to itself`);
    if (!["alternative", "regression", "progression"].includes(relation.kind)) errors.push(`${exercise.id}: invalid relation ${relation.kind}`);
  }
}

const sourceEquipmentIds = new Set();
for (const item of homeGym.equipment ?? []) {
  if (!item.sourceId) errors.push("home gym equipment: missing sourceId");
  if (sourceEquipmentIds.has(item.sourceId)) errors.push(`home gym equipment: duplicate sourceId ${item.sourceId}`);
  sourceEquipmentIds.add(item.sourceId);
}
const sourceExerciseIds = new Set();
let sourceLinkCount = 0;
for (const exercise of homeGym.exercises ?? []) {
  if (!exercise.name) errors.push("home gym exercise: missing English name");
  if (!exercise.sourceIds?.length) errors.push(`${exercise.name}: missing source IDs`);
  for (const id of exercise.sourceIds ?? []) {
    if (sourceExerciseIds.has(id)) errors.push(`home gym exercise: duplicate source ID ${id}`);
    sourceExerciseIds.add(id);
  }
  for (const id of exercise.equipmentIds ?? []) {
    sourceLinkCount += 1;
    if (!sourceEquipmentIds.has(id)) errors.push(`${exercise.name}: unknown equipment ${id}`);
  }
  if (!exercise.movementPatterns?.length) errors.push(`${exercise.name}: missing movement pattern`);
  if (!exercise.primaryMuscles?.length) errors.push(`${exercise.name}: missing primary muscles`);
}
if (homeGym.stats?.equipmentItems !== homeGym.equipment?.length) errors.push("home gym stats: equipment count mismatch");
if (homeGym.stats?.uniqueExercises !== homeGym.exercises?.length) errors.push("home gym stats: unique exercise count mismatch");
if (homeGym.stats?.exerciseEquipmentLinks !== sourceExerciseIds.size) errors.push("home gym stats: source row count mismatch");
if (sourceLinkCount < homeGym.exercises?.length) errors.push("home gym database: exercise-equipment links are incomplete");
if (homeGym.schemaVersion !== 2 || homeGym.source?.language !== "en") errors.push("home gym database must use the English-only v2 schema");
if (greekCharacters.test(JSON.stringify(homeGym))) errors.push("home gym database contains Greek characters");

if (errors.length) {
  console.error(`Training catalog validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Training catalog valid: ${catalog.exercises.length} curated exercises plus ${homeGym.exercises.length} imported exercises, ${homeGym.equipment.length} source equipment items and ${homeGym.stats.exerciseEquipmentLinks} source links.`);

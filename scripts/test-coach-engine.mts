import assert from "node:assert/strict";
import { buildCoachContext } from "../lib/coach/context-builder.ts";
import { demoCoachContext } from "../lib/coach/demo-context.ts";
import { routeCoachIntent } from "../lib/coach/intent-router.ts";
import { LocalCoachProvider } from "../lib/coach/providers/local-provider.ts";

assert.equal(routeCoachIntent("What should I train today?"), "training");
assert.equal(routeCoachIntent("What should I eat now?"), "nutrition");
assert.equal(routeCoachIntent("Why has my weight stalled?"), "progress");
assert.equal(routeCoachIntent("I slept badly and feel sore"), "recovery");
assert.equal(routeCoachIntent("I have sharp chest pain"), "health_safety");

const nutritionContext = buildCoachContext("nutrition", demoCoachContext);
assert.deepEqual(nutritionContext.domains, ["goals", "recentMeals", "nutritionTarget", "preferences", "memory"]);
assert.equal("measurements" in nutritionContext.data, false);
assert.equal("recentWorkouts" in nutritionContext.data, false);
assert.equal(nutritionContext.data.memory?.every((fact) => fact.scope === "nutrition"), true);

const healthContext = buildCoachContext("health_safety", demoCoachContext);
assert.deepEqual(healthContext.domains, []);
assert.deepEqual(healthContext.data, {});

const provider = new LocalCoachProvider();
const nutritionResponse = await provider.complete({ message: "What should I eat now?", intent: "nutrition", context: nutritionContext, recentMessages: [] });
assert.match(nutritionResponse.content, /remaining/);

console.log("Coach intent, privacy context, provider and safety-hold tests passed.");

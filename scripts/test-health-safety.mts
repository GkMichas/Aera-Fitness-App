import assert from "node:assert/strict";
import { assessHealthIntake } from "../lib/health/safety-engine.ts";
import type { HealthIntake } from "../types/health-safety.ts";

const base: HealthIntake = {
  description: "My right knee aches when I squat and started three days ago.",
  bodyArea: "Right knee",
  onset: "days",
  severity: 3,
  duringExercise: true,
  injury: false,
  swelling: false,
  weakness: false,
  limitedMovement: false,
  worsening: false,
  emergencyFlags: [],
  redFlagsReviewed: true,
  acknowledgedPrivacy: true,
};

const routine = assessHealthIntake(base);
assert.equal(routine.urgency, "routine");
assert.equal(routine.rulesVersion, "aera-safety-v1");
assert.match(routine.uncertainty, /not a diagnosis/i);

const explicitEmergency = assessHealthIntake({ ...base, description: "I have chest pressure.", severity: undefined, emergencyFlags: ["chest_pressure"] });
assert.equal(explicitEmergency.urgency, "emergency");
assert.match(explicitEmergency.escalation, /112/);

const textEmergency = assessHealthIntake({ ...base, description: "I cannot breathe and I am gasping." });
assert.equal(textEmergency.urgency, "emergency");

const urgentSeverity = assessHealthIntake({ ...base, severity: 7 });
assert.equal(urgentSeverity.urgency, "urgent");
assert.ok(urgentSeverity.matchedRuleIds.includes("U_SEVERITY_7_PLUS"));

const urgentFunction = assessHealthIntake({ ...base, description: "My knee is painful and I cannot bear weight on it." });
assert.equal(urgentFunction.urgency, "urgent");

const incomplete = assessHealthIntake({ ...base, redFlagsReviewed: false });
assert.equal(incomplete.urgency, "incomplete");

for (const assessment of [routine, explicitEmergency, textEmergency, urgentSeverity, urgentFunction, incomplete]) {
  const text = JSON.stringify(assessment).toLowerCase();
  assert.doesNotMatch(text, /you definitely have|this proves|you don't need a doctor/);
}

console.log("Health safety classification, escalation, uncertainty and no-diagnosis tests passed.");

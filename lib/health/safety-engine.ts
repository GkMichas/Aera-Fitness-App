import type { HealthIntake, HealthSafetyAssessment } from "@/types/health-safety";

const sources = [
  { label: "EU emergency number 112", url: "https://digital-strategy.ec.europa.eu/en/policies/112" },
  { label: "CDC stroke signs", url: "https://www.cdc.gov/stroke/signs-symptoms/" },
  { label: "NHS emergency guidance", url: "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/" },
];

const emergencyTextRules: { id: string; pattern: RegExp }[] = [
  { id: "E_CHEST", pattern: /\b(chest (pressure|tightness|heaviness|pain).*(short of breath|sweat|dizz|spread)|crushing chest|squeezing chest)\b/i },
  { id: "E_BREATHING", pattern: /\b(can(?:not|'t) breathe|gasping|choking|unable to speak.*breath|severe difficulty breathing)\b/i },
  { id: "E_STROKE", pattern: /\b(face droop|slurred speech|one[- ]sided weakness|sudden.*(speech|weakness|numbness|vision)|worst headache.*sudden)\b/i },
  { id: "E_UNRESPONSIVE", pattern: /\b(unconscious|unresponsive|passed out.*not (waking|responding))\b/i },
  { id: "E_BLEEDING", pattern: /\b(heavy bleeding|bleeding (will not|won't) stop)\b/i },
  { id: "E_SEIZURE", pattern: /\b(first seizure|seizure.*(five|5) minutes|repeated seizure)\b/i },
  { id: "E_SELF_HARM", pattern: /\b(overdose|tried to (end|kill)|about to hurt myself|immediate self[- ]harm)\b/i },
];

const urgentTextRules: { id: string; pattern: RegExp }[] = [
  { id: "U_FUNCTION", pattern: /\b(cannot|can't|unable to) (walk|bear weight|move|use (my|the))\b/i },
  { id: "U_JOINT", pattern: /\b(locking|giving way|visible swelling|deformity|hot red joint)\b/i },
  { id: "U_NEURO", pattern: /\b(new numbness|new weakness|loss of sensation)\b/i },
  { id: "U_BLOOD", pattern: /\b(coughing up blood|vomiting blood|blood in vomit)\b/i },
];

export function assessHealthIntake(input: HealthIntake): HealthSafetyAssessment {
  const text = input.description.trim();
  const matchedRuleIds: string[] = input.emergencyFlags.map((flag) => `E_FLAG_${flag.toUpperCase()}`);
  for (const rule of emergencyTextRules) if (rule.pattern.test(text)) matchedRuleIds.push(rule.id);
  if (matchedRuleIds.length > 0) return emergency(matchedRuleIds);

  if (!input.redFlagsReviewed || !input.acknowledgedPrivacy || text.length < 10 || input.severity === undefined) {
    return result("incomplete", "More information is needed", "AERA cannot safely classify this concern from the available details.", [], "Complete the red-flag check and the required symptom details before relying on this assessment.", matchedRuleIds);
  }

  for (const rule of urgentTextRules) if (rule.pattern.test(text)) matchedRuleIds.push(rule.id);
  if ((input.severity ?? 0) >= 7) matchedRuleIds.push("U_SEVERITY_7_PLUS");
  if (input.weakness) matchedRuleIds.push("U_WEAKNESS");
  if (input.limitedMovement && input.injury) matchedRuleIds.push("U_INJURY_FUNCTION");
  if (input.swelling && input.worsening) matchedRuleIds.push("U_SWELLING_WORSENING");
  if (input.worsening && (input.severity ?? 0) >= 5) matchedRuleIds.push("U_WORSENING");
  if (matchedRuleIds.length > 0) return result("urgent", "Professional assessment is appropriate", "The information includes features that should not be managed only by changing a workout.", ["Stop the activity that provokes the symptoms.", "Avoid testing the painful or limited movement repeatedly."], "Contact an urgent-care service or qualified clinician today. If symptoms become severe or any emergency sign appears, call local emergency services.", matchedRuleIds);

  const routineGuidance = ["Reduce or stop movements that provoke the symptom.", "Do not train through worsening pain, weakness or loss of movement.", "Monitor whether severity, swelling, function or the overall pattern changes."];
  if ((input.severity ?? 0) <= 3 && !input.swelling && !input.weakness && !input.limitedMovement) {
    return result("routine", "No emergency flag was identified", "The structured answers do not currently match an emergency or urgent rule.", routineGuidance, "Arrange a routine professional assessment if it persists, returns repeatedly, worsens or affects normal activity.", matchedRuleIds);
  }
  return result("routine", "Monitor and consider professional guidance", "The structured answers do not currently match an emergency rule, but AERA cannot determine the cause.", routineGuidance, "Consider a qualified clinician, especially if this has lasted more than a few days or is limiting normal activity.", matchedRuleIds);
}

function emergency(matchedRuleIds: string[]): HealthSafetyAssessment {
  return result("emergency", "Seek emergency help now", "One or more answers match a potentially life-threatening red flag. AERA cannot assess this safely online.", ["Stop exercising and do not drive yourself if you feel unwell.", "If possible, stay with another person while help is arranged."], "Call your local emergency number now. In the European Union, call 112 free of charge.", matchedRuleIds);
}

function result(urgency: HealthSafetyAssessment["urgency"], title: string, summary: string, generalGuidance: string[], escalation: string, matchedRuleIds: string[]): HealthSafetyAssessment {
  return { urgency, title, summary, generalGuidance, escalation, uncertainty: "This is a safety classification, not a diagnosis. Symptoms can have many causes and an online tool cannot examine you.", matchedRuleIds, rulesVersion: "aera-safety-v1", sources };
}

export type HealthUrgency = "emergency" | "urgent" | "routine" | "incomplete";
export type EmergencyFlag = "chest_pressure" | "severe_breathing" | "stroke_signs" | "unresponsive" | "heavy_bleeding" | "seizure" | "overdose_or_self_harm";

export interface HealthIntake {
  description: string;
  bodyArea?: string;
  onset?: "today" | "days" | "weeks" | "months";
  severity?: number;
  duringExercise?: boolean;
  injury?: boolean;
  swelling?: boolean;
  weakness?: boolean;
  limitedMovement?: boolean;
  worsening?: boolean;
  emergencyFlags: EmergencyFlag[];
  redFlagsReviewed: boolean;
  acknowledgedPrivacy: boolean;
}

export interface HealthSafetyAssessment {
  urgency: HealthUrgency;
  title: string;
  summary: string;
  generalGuidance: string[];
  escalation: string;
  uncertainty: string;
  matchedRuleIds: string[];
  rulesVersion: "aera-safety-v1";
  sources: { label: string; url: string }[];
}

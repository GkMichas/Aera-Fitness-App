import { NextResponse, type NextRequest } from "next/server";
import { assessHealthIntake } from "@/lib/health/safety-engine";
import { HealthAuthenticationError, persistHealthAssessment } from "@/lib/health/persistence";
import type { EmergencyFlag, HealthIntake } from "@/types/health-safety";
import { rateLimit } from "@/lib/security/rate-limit";

const flags = new Set<EmergencyFlag>(["chest_pressure", "severe_breathing", "stroke_signs", "unresponsive", "heavy_bleeding", "seizure", "overdose_or_self_harm"]);
const onsets = new Set(["today", "days", "weeks", "months"]);

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const intake = parseIntake(body);
    if (!intake) return NextResponse.json({ error: "Complete the required health intake fields." }, { status: 400 });
    const assessment = assessHealthIntake(intake);
    const limit = rateLimit(request, "health", 12, 10 * 60_000);
    if (!limit.allowed && assessment.urgency !== "emergency") return NextResponse.json({ error: "Assessment limit reached. If symptoms may be urgent, contact local emergency or urgent-care services now." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds), "Cache-Control": "no-store" } });
    const persistence = await persistHealthAssessment(intake, assessment);
    return NextResponse.json({ assessment, ...persistence }, { headers: { "Cache-Control": "no-store", "X-RateLimit-Remaining": String(limit.remaining) } });
  } catch (error) {
    if (error instanceof HealthAuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("Health assessment failed", error);
    return NextResponse.json({ error: "The safety assessment is unavailable. If symptoms may be urgent, contact local emergency or urgent-care services now." }, { status: 503 });
  }
}

function parseIntake(value: unknown): HealthIntake | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.description !== "string" || !item.description.trim() || item.description.length > 2000) return null;
  if (typeof item.redFlagsReviewed !== "boolean" || typeof item.acknowledgedPrivacy !== "boolean") return null;
  if (!Array.isArray(item.emergencyFlags) || !item.emergencyFlags.every((flag): flag is EmergencyFlag => typeof flag === "string" && flags.has(flag as EmergencyFlag))) return null;
  if (item.severity !== undefined && (!Number.isInteger(item.severity) || Number(item.severity) < 1 || Number(item.severity) > 10)) return null;
  if (item.onset !== undefined && (typeof item.onset !== "string" || !onsets.has(item.onset))) return null;
  if (item.bodyArea !== undefined && (typeof item.bodyArea !== "string" || item.bodyArea.length > 80)) return null;
  for (const key of ["duringExercise", "injury", "swelling", "weakness", "limitedMovement", "worsening"] as const) if (item[key] !== undefined && typeof item[key] !== "boolean") return null;
  return {
    description: item.description.trim(),
    bodyArea: typeof item.bodyArea === "string" ? item.bodyArea.trim() : undefined,
    onset: item.onset as HealthIntake["onset"],
    severity: item.severity as number | undefined,
    duringExercise: item.duringExercise as boolean | undefined,
    injury: item.injury as boolean | undefined,
    swelling: item.swelling as boolean | undefined,
    weakness: item.weakness as boolean | undefined,
    limitedMovement: item.limitedMovement as boolean | undefined,
    worsening: item.worsening as boolean | undefined,
    emergencyFlags: item.emergencyFlags,
    redFlagsReviewed: item.redFlagsReviewed,
    acknowledgedPrivacy: item.acknowledgedPrivacy,
  };
}

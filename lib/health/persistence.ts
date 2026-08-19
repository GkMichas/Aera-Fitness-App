import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { HealthIntake, HealthSafetyAssessment } from "@/types/health-safety";

export class HealthAuthenticationError extends Error {}

export async function persistHealthAssessment(intake: HealthIntake, assessment: HealthSafetyAssessment) {
  if (!intake.acknowledgedPrivacy) return { eventId: null, isDemo: !hasSupabaseEnv() };
  if (!hasSupabaseEnv()) return { eventId: null, isDemo: true };
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new HealthAuthenticationError("Sign in to save a private health assessment.");
  const { data: event, error } = await supabase.from("health_events").insert({
    user_id: user.id,
    intake_payload: intake,
    urgency: assessment.urgency,
    rules_version: assessment.rulesVersion,
    acknowledged_at: new Date().toISOString(),
  }).select("id").single();
  if (error) throw error;
  const { error: auditError } = await supabase.from("health_safety_audit").insert({
    user_id: user.id,
    health_event_id: event.id,
    urgency: assessment.urgency,
    matched_rule_ids: assessment.matchedRuleIds,
    rules_version: assessment.rulesVersion,
  });
  if (auditError) throw auditError;
  return { eventId: event.id, isDemo: false };
}

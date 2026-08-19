import { contextPolicy } from "@/lib/coach/context-builder";
import { demoCoachContext } from "@/lib/coach/demo-context";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { CoachIntent, UserContextSnapshot } from "@/types/coach";

export class CoachAuthenticationError extends Error {}

export async function loadCoachSnapshot(intent: CoachIntent): Promise<{ snapshot: UserContextSnapshot; userId: string | null; isDemo: boolean }> {
  if (!hasSupabaseEnv()) return { snapshot: demoCoachContext, userId: null, isDemo: true };

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new CoachAuthenticationError("Sign in to use the connected Coach.");

  const userId = authData.user.id;
  const domains = new Set(contextPolicy[intent]);
  const snapshot: UserContextSnapshot = {};

  if (domains.has("profile")) {
    const { data } = await supabase.from("profiles").select("first_name,height_cm,current_weight_kg").eq("id", userId).maybeSingle();
    if (data) snapshot.profile = { firstName: data.first_name, heightCm: numberOrUndefined(data.height_cm), currentWeightKg: numberOrUndefined(data.current_weight_kg) };
  }
  if (domains.has("goals")) {
    const { data } = await supabase.from("goals").select("primary_goal,target_weight_kg").eq("user_id", userId).eq("is_active", true).maybeSingle();
    if (data) snapshot.goals = { primaryGoal: data.primary_goal, targetWeightKg: numberOrUndefined(data.target_weight_kg) };
  }
  if (domains.has("measurements")) {
    const { data } = await supabase.from("body_measurements").select("weight_kg,waist_cm,measured_at").eq("user_id", userId).order("measured_at", { ascending: false }).limit(8);
    snapshot.measurements = data?.map((item) => ({ weightKg: numberOrUndefined(item.weight_kg), waistCm: numberOrUndefined(item.waist_cm), measuredAt: item.measured_at })) ?? [];
  }
  if (domains.has("recentWorkouts")) {
    const { data } = await supabase.from("workouts").select("name,status,scheduled_for,duration_minutes").eq("user_id", userId).order("scheduled_for", { ascending: false }).limit(6);
    snapshot.recentWorkouts = data?.map((item) => ({ name: item.name, status: item.status, performedAt: item.scheduled_for ?? undefined, durationMinutes: item.duration_minutes })) ?? [];
  }
  if (domains.has("recentMeals")) {
    const { data } = await supabase.from("meals").select("name,logged_at,meal_items(calories,protein_g)").eq("user_id", userId).order("logged_at", { ascending: false }).limit(8);
    snapshot.recentMeals = data?.map((meal) => ({
      name: meal.name,
      loggedAt: meal.logged_at,
      calories: meal.meal_items.reduce((sum, item) => sum + Number(item.calories), 0),
      proteinG: meal.meal_items.reduce((sum, item) => sum + Number(item.protein_g), 0),
    })) ?? [];
  }
  if (domains.has("nutritionTarget")) {
    const { data } = await supabase.from("nutrition_targets").select("calories,protein_g,carbs_g,fat_g").eq("user_id", userId).maybeSingle();
    if (data) snapshot.nutritionTarget = { calories: data.calories, proteinG: Number(data.protein_g), carbsG: Number(data.carbs_g), fatG: Number(data.fat_g) };
  }
  if (domains.has("latestCheckIn")) {
    const { data } = await supabase.from("daily_check_ins").select("energy,sleep_quality,stress,soreness,check_in_date").eq("user_id", userId).order("check_in_date", { ascending: false }).limit(1).maybeSingle();
    if (data) snapshot.latestCheckIn = { energy: data.energy ?? undefined, sleepQuality: data.sleep_quality ?? undefined, stress: data.stress ?? undefined, soreness: data.soreness ?? undefined, checkInDate: data.check_in_date };
  }
  if (domains.has("preferences") || domains.has("equipment") || domains.has("trainingSchedule")) {
    const { data } = await supabase.from("user_preferences").select("session_duration_minutes,dietary_preferences,allergies,equipment,training_days_per_week").eq("user_id", userId).maybeSingle();
    if (data) {
      if (domains.has("preferences")) snapshot.preferences = { sessionDurationMinutes: data.session_duration_minutes ?? undefined, dietaryPreferences: data.dietary_preferences, allergies: data.allergies };
      if (domains.has("equipment")) snapshot.equipment = data.equipment;
      if (domains.has("trainingSchedule")) snapshot.trainingSchedule = { daysPerWeek: data.training_days_per_week ?? undefined };
    }
  }
  if (domains.has("memory")) {
    const { data } = await supabase.from("coach_memory_facts").select("fact_key,summary,scope").eq("user_id", userId).eq("status", "active").eq("scope", intent).order("updated_at", { ascending: false }).limit(5);
    snapshot.memory = data?.map((item) => ({ key: item.fact_key, summary: item.summary, scope: item.scope })) ?? [];
  }

  return { snapshot, userId, isDemo: false };
}

function numberOrUndefined(value: number | string | null) {
  return value === null ? undefined : Number(value);
}

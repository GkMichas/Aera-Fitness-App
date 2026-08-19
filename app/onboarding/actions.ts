"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalNumber(formData: FormData, key: string) {
  const raw = text(formData, key);
  if (!raw) return null;
  const number = Number(raw);
  return Number.isFinite(number) ? number : null;
}

function list(formData: FormData, key: string) {
  return formData.getAll(key).map(String).map((item) => item.trim()).filter(Boolean);
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login?next=/onboarding/goal");
  return { supabase, user };
}

async function markStep(userId: string, step: number, nextStep: number, draft: Record<string, unknown>) {
  const { supabase } = await authenticatedClient();
  const { data: progress } = await supabase
    .from("onboarding_progress")
    .select("completed_steps,draft")
    .eq("user_id", userId)
    .maybeSingle();

  const completed = Array.from(new Set([...(progress?.completed_steps ?? []), step]));
  await supabase.from("onboarding_progress").upsert({
    user_id: userId,
    current_step: nextStep,
    completed_steps: completed,
    draft: { ...(progress?.draft ?? {}), ...draft },
  });
}

export async function saveGoal(formData: FormData) {
  const primaryGoal = text(formData, "primaryGoal");
  if (!primaryGoal) redirect("/onboarding/goal?error=Choose+a+primary+goal.");
  const { supabase, user } = await authenticatedClient();
  const payload = {
    primary_goal: primaryGoal,
    secondary_goals: list(formData, "secondaryGoals"),
    target_weight_kg: optionalNumber(formData, "targetWeightKg"),
    target_date: text(formData, "targetDate") || null,
  };
  const { data: existing } = await supabase.from("goals").select("id").eq("user_id", user.id).eq("is_active", true).maybeSingle();
  const query = existing
    ? supabase.from("goals").update(payload).eq("id", existing.id)
    : supabase.from("goals").insert({ ...payload, user_id: user.id });
  const { error } = await query;
  if (error) redirect(`/onboarding/goal?error=${encodeURIComponent(error.message)}`);
  await markStep(user.id, 2, 3, { goal: payload });
  redirect("/onboarding/about");
}

export async function saveAbout(formData: FormData) {
  const firstName = text(formData, "firstName");
  const age = optionalNumber(formData, "age");
  const birthDate = age ? new Date(new Date().getFullYear() - age, 0, 1).toISOString().slice(0, 10) : null;
  const payload = {
    first_name: firstName,
    birth_date: birthDate,
    sex: text(formData, "sex") || null,
    height_cm: optionalNumber(formData, "heightCm"),
    current_weight_kg: optionalNumber(formData, "weightKg"),
  };
  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
  if (error) redirect(`/onboarding/about?error=${encodeURIComponent(error.message)}`);
  await markStep(user.id, 3, 4, { about: payload });
  redirect("/onboarding/measurements");
}

export async function saveMeasurements(formData: FormData) {
  const payload = {
    waist_cm: optionalNumber(formData, "waistCm"),
    neck_cm: optionalNumber(formData, "neckCm"),
    chest_cm: optionalNumber(formData, "chestCm"),
    arm_cm: optionalNumber(formData, "armCm"),
    thigh_cm: optionalNumber(formData, "thighCm"),
    calf_cm: optionalNumber(formData, "calfCm"),
  };
  const hasMeasurement = Object.values(payload).some((item) => item !== null);
  const { supabase, user } = await authenticatedClient();
  if (hasMeasurement) {
    const { error } = await supabase.from("body_measurements").insert({ ...payload, user_id: user.id });
    if (error) redirect(`/onboarding/measurements?error=${encodeURIComponent(error.message)}`);
  }
  await markStep(user.id, 4, 5, { measurements: payload });
  redirect("/onboarding/photos");
}

export async function savePhotos(formData: FormData) {
  const { supabase, user } = await authenticatedClient();
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

  for (const view of ["front", "side", "back"] as const) {
    const file = formData.get(view);
    if (!(file instanceof File) || file.size === 0) continue;
    if (!allowed.has(file.type) || file.size > 10 * 1024 * 1024) {
      redirect("/onboarding/photos?error=Use+JPG,+PNG+or+WebP+files+under+10MB.");
    }
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${user.id}/${crypto.randomUUID()}-${view}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("progress-photos").upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) redirect(`/onboarding/photos?error=${encodeURIComponent(uploadError.message)}`);
    const { error: recordError } = await supabase.from("progress_photos").insert({ user_id: user.id, storage_path: storagePath, view });
    if (recordError) redirect(`/onboarding/photos?error=${encodeURIComponent(recordError.message)}`);
  }

  await markStep(user.id, 5, 6, {});
  redirect("/onboarding/activity");
}

async function savePreferenceStep(step: number, nextStep: number, currentPath: string, nextPath: string, payload: Record<string, unknown>) {
  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase.from("user_preferences").upsert({ user_id: user.id, ...payload });
  if (error) redirect(`${currentPath}?error=${encodeURIComponent(error.message)}`);
  await markStep(user.id, step, nextStep, { [`step_${step}`]: payload });
  redirect(nextPath);
}

export async function saveActivity(formData: FormData) {
  await savePreferenceStep(6, 7, "/onboarding/activity", "/onboarding/training", { activity_level: text(formData, "activityLevel") });
}

export async function saveTraining(formData: FormData) {
  await savePreferenceStep(7, 8, "/onboarding/training", "/onboarding/nutrition", {
    training_locations: list(formData, "trainingLocations"),
    equipment: list(formData, "equipment"),
    training_days_per_week: optionalNumber(formData, "trainingDays"),
    session_duration_minutes: optionalNumber(formData, "sessionDuration"),
  });
}

export async function saveNutrition(formData: FormData) {
  await savePreferenceStep(8, 9, "/onboarding/nutrition", "/onboarding/motivation", {
    meals_per_day: optionalNumber(formData, "mealsPerDay"),
    dietary_preferences: list(formData, "dietaryPreferences"),
    foods_avoided: list(formData, "foodsAvoided"),
    allergies: list(formData, "allergies"),
  });
}

export async function saveMotivation(formData: FormData) {
  await savePreferenceStep(9, 10, "/onboarding/motivation", "/onboarding/plan", { motivation: text(formData, "motivation") });
}

export async function completeOnboarding() {
  const { supabase, user } = await authenticatedClient();
  await supabase.from("profiles").update({ onboarding_completed_at: new Date().toISOString() }).eq("id", user.id);
  await markStep(user.id, 10, 10, {});
  redirect("/home");
}

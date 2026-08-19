import { calculateNutritionAdherence, estimatedOneRepMax, generateWeeklyReview } from "@/lib/progress/calculations";
import { demoProgressData, demoWeeklyReview } from "@/lib/progress/demo";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { MeasurementPoint, ProgressDashboardData, WeeklyReviewResult } from "@/types/progress";

export async function loadProgressDashboard(): Promise<ProgressDashboardData> {
  if (!hasSupabaseEnv()) return demoProgressData;
  const { supabase, userId } = await authenticatedClient();
  const sixMonthsAgo = new Date(); sixMonthsAgo.setUTCMonth(sixMonthsAgo.getUTCMonth() - 6);
  const since = sixMonthsAgo.toISOString();
  const [measurementsResult, goalResult, setsResult, workoutsResult, mealsResult, targetResult, photosResult] = await Promise.all([
    supabase.from("body_measurements").select("measured_at,weight_kg,waist_cm,neck_cm,chest_cm,arm_cm,thigh_cm,calf_cm").eq("user_id", userId).order("measured_at", { ascending: true }),
    supabase.from("goals").select("target_weight_kg").eq("user_id", userId).eq("is_active", true).maybeSingle(),
    supabase.from("exercise_sets").select("completed_at,load_kg,reps,exercises(name)").eq("user_id", userId).eq("status", "completed").gte("completed_at", since).not("load_kg", "is", null).not("reps", "is", null).order("completed_at", { ascending: true }),
    supabase.from("workouts").select("scheduled_for,status").eq("user_id", userId).gte("scheduled_for", since.slice(0, 10)).order("scheduled_for", { ascending: true }),
    supabase.from("meals").select("logged_at,meal_items(calories)").eq("user_id", userId).gte("logged_at", since).order("logged_at", { ascending: true }),
    supabase.from("nutrition_targets").select("calories").eq("user_id", userId).maybeSingle(),
    supabase.from("progress_photos").select("id,storage_path,view,captured_on").eq("user_id", userId).order("captured_on", { ascending: true }),
  ]);
  const failed = [measurementsResult, goalResult, setsResult, workoutsResult, mealsResult, targetResult, photosResult].find((result) => result.error);
  if (failed?.error) throw failed.error;

  const measurements: MeasurementPoint[] = (measurementsResult.data ?? []).map((item) => ({ date: item.measured_at.slice(0, 10), weightKg: numeric(item.weight_kg), waistCm: numeric(item.waist_cm), neckCm: numeric(item.neck_cm), chestCm: numeric(item.chest_cm), armCm: numeric(item.arm_cm), thighCm: numeric(item.thigh_cm), calfCm: numeric(item.calf_cm) }));
  const strength = (setsResult.data ?? []).flatMap((item) => {
    const exercise = item.exercises?.[0]?.name;
    return item.completed_at && item.load_kg !== null && item.reps ? [{ date: item.completed_at.slice(0, 10), exercise: exercise ?? "Loaded exercise", estimatedOneRepMaxKg: estimatedOneRepMax(Number(item.load_kg), item.reps) }] : [];
  });
  const trainingGroups = groupByWeek(workoutsResult.data ?? [], (item) => item.scheduled_for);
  const training = Array.from(trainingGroups, ([weekStart, items]) => ({ weekStart, planned: items.length, completed: items.filter((item) => item.status === "completed").length }));
  const dailyMeals = new Map<string, number>();
  for (const meal of mealsResult.data ?? []) {
    const day = meal.logged_at.slice(0, 10);
    dailyMeals.set(day, (dailyMeals.get(day) ?? 0) + meal.meal_items.reduce((sum, item) => sum + Number(item.calories), 0));
  }
  const mealWeeks = groupByWeek(Array.from(dailyMeals, ([date, calories]) => ({ date, calories })), (item) => item.date);
  const target = targetResult.data?.calories;
  const nutrition = Array.from(mealWeeks, ([weekStart, days]) => ({ weekStart, adherencePercent: calculateNutritionAdherence(days.map((day) => day.calories), target) ?? 0 }));
  const photos = await Promise.all((photosResult.data ?? []).map(async (photo) => {
    const { data } = await supabase.storage.from("progress-photos").createSignedUrl(photo.storage_path, 3600);
    return { id: photo.id, view: photo.view, capturedOn: photo.captured_on, url: data?.signedUrl };
  }));
  return { measurements, strength, training, nutrition, photos, targetWeightKg: numeric(goalResult.data?.target_weight_kg), isDemo: false };
}

export async function loadWeeklyReview(): Promise<{ review: WeeklyReviewResult; isDemo: boolean }> {
  if (!hasSupabaseEnv()) return { review: demoWeeklyReview, isDemo: true };
  const { supabase, userId } = await authenticatedClient();
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = new Date(end); start.setUTCDate(end.getUTCDate() - 6);
  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);
  const [measurements, workouts, meals, target, checkIns] = await Promise.all([
    supabase.from("body_measurements").select("measured_at,weight_kg,waist_cm").eq("user_id", userId).gte("measured_at", start.toISOString()).lte("measured_at", `${endDate}T23:59:59Z`).order("measured_at", { ascending: true }),
    supabase.from("workouts").select("status,scheduled_for").eq("user_id", userId).gte("scheduled_for", startDate).lte("scheduled_for", endDate),
    supabase.from("meals").select("logged_at,meal_items(calories)").eq("user_id", userId).gte("logged_at", start.toISOString()).lte("logged_at", `${endDate}T23:59:59Z`),
    supabase.from("nutrition_targets").select("calories").eq("user_id", userId).maybeSingle(),
    supabase.from("daily_check_ins").select("sleep_duration_minutes").eq("user_id", userId).gte("check_in_date", startDate).lte("check_in_date", endDate),
  ]);
  const results = [measurements, workouts, meals, target, checkIns];
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
  const mapped = (measurements.data ?? []).map((item) => ({ date: item.measured_at.slice(0, 10), weightKg: numeric(item.weight_kg), waistCm: numeric(item.waist_cm) }));
  const daily = new Map<string, number>();
  for (const meal of meals.data ?? []) { const day = meal.logged_at.slice(0, 10); daily.set(day, (daily.get(day) ?? 0) + meal.meal_items.reduce((sum, item) => sum + Number(item.calories), 0)); }
  return { review: generateWeeklyReview({ weekStart: startDate, weekEnd: endDate, startMeasurement: mapped[0], endMeasurement: mapped.at(-1), completedWorkouts: workouts.data?.filter((item) => item.status === "completed").length ?? 0, plannedWorkouts: workouts.data?.length ?? 0, dailyCalories: Array.from(daily.values()), calorieTarget: target.data?.calories, sleepMinutes: (checkIns.data ?? []).flatMap((item) => item.sleep_duration_minutes ?? []) }), isDemo: false };
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Authenticated user required");
  return { supabase, userId: user.id };
}
function numeric(value: string | number | null | undefined) { return value === null || value === undefined ? undefined : Number(value); }
function monday(date: string) { const value = new Date(`${date}T00:00:00Z`); const day = value.getUTCDay(); value.setUTCDate(value.getUTCDate() - (day === 0 ? 6 : day - 1)); return value.toISOString().slice(0, 10); }
function groupByWeek<T>(items: T[], date: (item: T) => string | null) { const groups = new Map<string, T[]>(); for (const item of items) { const value = date(item); if (!value) continue; const key = monday(value.slice(0, 10)); groups.set(key, [...(groups.get(key) ?? []), item]); } return groups; }

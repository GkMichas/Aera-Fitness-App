import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!hasSupabaseEnv()) return NextResponse.json({ error: "No cloud account is connected in local mode." }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to export account data." }, { status: 401 });
  const [profile, goals, preferences, measurements, checkIns, photos, plans, sessions, meals, reviews, coach, health, consents] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id),
    supabase.from("goals").select("*").eq("user_id", user.id),
    supabase.from("user_preferences").select("*").eq("user_id", user.id),
    supabase.from("body_measurements").select("*").eq("user_id", user.id),
    supabase.from("daily_check_ins").select("*").eq("user_id", user.id),
    supabase.from("progress_photos").select("id, view, captured_on, created_at").eq("user_id", user.id),
    supabase.from("training_plans").select("*").eq("user_id", user.id),
    supabase.from("workout_sessions").select("*").eq("user_id", user.id),
    supabase.from("meals").select("*, meal_items(*)").eq("user_id", user.id),
    supabase.from("weekly_reviews").select("*").eq("user_id", user.id),
    supabase.from("coach_conversations").select("*, coach_messages(*)").eq("user_id", user.id),
    supabase.from("health_events").select("*").eq("user_id", user.id),
    supabase.from("user_consents").select("*").eq("user_id", user.id),
  ]);
  const results = { profile, goals, preferences, measurements, checkIns, photos, plans, sessions, meals, reviews, coach, health, consents };
  const failed = Object.entries(results).find(([, result]) => result.error);
  if (failed) return NextResponse.json({ error: `Could not export ${failed[0]}.` }, { status: 503 });
  return NextResponse.json({ exportedAt: new Date().toISOString(), user: { id: user.id, email: user.email, createdAt: user.created_at }, data: Object.fromEntries(Object.entries(results).map(([key, result]) => [key, result.data])) }, { headers: { "Cache-Control": "no-store", "Content-Disposition": `attachment; filename="aera-account-${new Date().toISOString().slice(0, 10)}.json"` } });
}

export async function DELETE(request: Request) {
  if (!hasSupabaseEnv()) return NextResponse.json({ error: "No cloud account is connected in local mode." }, { status: 400 });
  const body = await request.json().catch(() => null) as { confirmation?: unknown } | null;
  if (body?.confirmation !== "DELETE MY AERA ACCOUNT") return NextResponse.json({ error: "Type the full confirmation phrase." }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to delete the account." }, { status: 401 });
  const { data: objects } = await supabase.storage.from("progress-photos").list(user.id, { limit: 1_000 });
  if (objects?.length) await supabase.storage.from("progress-photos").remove(objects.map((object) => `${user.id}/${object.name}`));
  const { error } = await supabase.rpc("delete_own_account");
  if (error) return NextResponse.json({ error: "Account deletion failed. No confirmation was issued." }, { status: 503 });
  return NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
}

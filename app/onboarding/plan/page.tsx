import { completeOnboarding } from "@/app/onboarding/actions";
import { ageFromBirthDate, calculateInitialTargets } from "@/lib/health/calculations";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const goalLabels: Record<string, string> = {
  lose_fat: "Lose fat",
  build_muscle: "Build muscle",
  get_stronger: "Get stronger",
  improve_fitness: "Improve fitness",
  maintain_weight: "Maintain weight",
  body_recomposition: "Body recomposition",
};

export default async function Page() {
  let plan = { goal: "Lose fat", weight: 84.2, training: "4 days · dumbbells", calories: 2240, protein: 168 };

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const [{ data: profile }, { data: goal }, { data: preferences }] = await Promise.all([
      supabase.from("profiles").select("birth_date,sex,height_cm,current_weight_kg").maybeSingle(),
      supabase.from("goals").select("primary_goal").eq("is_active", true).maybeSingle(),
      supabase.from("user_preferences").select("activity_level,training_days_per_week,equipment").maybeSingle(),
    ]);
    if (profile?.height_cm && profile?.current_weight_kg && profile?.sex && goal?.primary_goal) {
      const targets = calculateInitialTargets({
        weightKg: Number(profile.current_weight_kg),
        heightCm: Number(profile.height_cm),
        age: ageFromBirthDate(profile.birth_date),
        sex: profile.sex,
        activityLevel: preferences?.activity_level ?? "sedentary",
        goal: goal.primary_goal,
      });
      plan = {
        goal: goalLabels[goal.primary_goal] ?? goal.primary_goal,
        weight: Number(profile.current_weight_kg),
        training: `${preferences?.training_days_per_week ?? 3} days · ${preferences?.equipment?.[0] ?? "bodyweight"}`,
        calories: targets.calories,
        protein: targets.proteinGrams,
      };
    }
  }

  return (
    <main className="reference-stage">
      <section className="flex h-[844px] w-[390px] flex-none flex-col overflow-hidden rounded-[40px] border border-black/15 bg-[var(--aera-forest)] px-6 pb-[26px] text-white shadow-[0_12px_32px_rgba(23,23,23,.08)] max-[453px]:rounded-none max-[453px]:border-0 max-[453px]:shadow-none">
        <div className="flex h-[46px] items-center justify-between text-[13px] font-semibold" aria-hidden="true"><span>9:41</span><span>ᯤ&nbsp;&nbsp;⏻</span></div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[.16em] text-white/60">Your AERA plan</p>
        <h1 className="mt-6 max-w-[16ch] text-[34px] font-bold leading-[1.08] tracking-[-.025em]">{plan.goal} first, strength protected.</h1>
        <dl className="mt-7 divide-y divide-white/15 border-y border-white/15">
          {[["Primary goal", plan.goal], ["Current weight", `${plan.weight} kg`], ["Training", plan.training], ["Nutrition", `${plan.calories.toLocaleString()} kcal · ${plan.protein} g P`]].map(([label, value]) => <div key={label} className="flex items-baseline justify-between py-4"><dt className="text-sm text-white/65">{label}</dt><dd className="text-base font-semibold">{value}</dd></div>)}
        </dl>
        <p className="mt-6 text-[15px] leading-[1.6] text-white/75">This is a deterministic starting point. AERA will adjust it from your check-ins, sessions and measurements.</p>
        <form action={completeOnboarding} className="mt-auto"><button className="min-h-[52px] w-full rounded-lg bg-white px-4 text-base font-semibold text-[var(--aera-ink)]" type="submit">Meet Your Coach</button></form>
      </section>
    </main>
  );
}

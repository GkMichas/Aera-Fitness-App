import { Choice, Field, OnboardingFrame } from "@/components/onboarding-screen";
import { saveNutrition } from "@/app/onboarding/actions";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <OnboardingFrame step={8} title="How do you like to eat?" description="Your plan should fit your preferences, budget and safety needs." backHref="/onboarding/training" action={saveNutrition} error={error}>
    <Field label="Meals per day" name="mealsPerDay" type="number" min={1} max={10} required />
    <p className="text-xs font-semibold uppercase tracking-[.1em] text-black/50">Dietary preference</p>
    <Choice type="checkbox" name="dietaryPreferences" value="no_preference">No preference</Choice><Choice type="checkbox" name="dietaryPreferences" value="mediterranean">Mediterranean</Choice><Choice type="checkbox" name="dietaryPreferences" value="vegetarian">Vegetarian</Choice><Choice type="checkbox" name="dietaryPreferences" value="vegan">Vegan</Choice>
    <Field label="Foods avoided" name="foodsAvoided" placeholder="Comma-free short description" /><Field label="Allergies / intolerances" name="allergies" placeholder="Leave blank if none" />
  </OnboardingFrame>;
}

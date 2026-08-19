import { Choice, Field, OnboardingFrame } from "@/components/onboarding-screen";
import { saveAbout } from "@/app/onboarding/actions";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <OnboardingFrame step={3} title="About you" description="These values set your initial calorie and protein baseline." backHref="/onboarding/goal" action={saveAbout} error={error}>
    <Field label="First name" name="firstName" required />
    <div className="grid grid-cols-2 gap-3"><Field label="Age" name="age" type="number" min={18} max={100} required /><Field label="Height (cm)" name="heightCm" type="number" min={80} max={260} step={0.1} required /></div>
    <Field label="Weight (kg)" name="weightKg" type="number" min={25} max={400} step={0.1} required />
    <div className="grid grid-cols-2 gap-2"><Choice name="sex" value="male" required>Male</Choice><Choice name="sex" value="female" required>Female</Choice><Choice name="sex" value="other" required>Other</Choice><Choice name="sex" value="prefer_not_to_say" required>Prefer not to say</Choice></div>
  </OnboardingFrame>;
}

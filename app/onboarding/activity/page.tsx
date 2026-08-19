import { Choice, OnboardingFrame } from "@/components/onboarding-screen";
import { saveActivity } from "@/app/onboarding/actions";

export default function Page() {
  return <OnboardingFrame step={6} title="How active are you?" description="Choose the option that best describes an ordinary week." backHref="/onboarding/photos" action={saveActivity}>
    <Choice name="activityLevel" value="sedentary" required>Sedentary</Choice><Choice name="activityLevel" value="lightly_active" required>Lightly active</Choice><Choice name="activityLevel" value="moderately_active" required>Moderately active</Choice><Choice name="activityLevel" value="very_active" required>Very active</Choice>
  </OnboardingFrame>;
}

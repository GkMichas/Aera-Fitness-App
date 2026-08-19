import { Choice, OnboardingFrame } from "@/components/onboarding-screen";
import { saveMotivation } from "@/app/onboarding/actions";

export default function Page() {
  return <OnboardingFrame step={9} title="What keeps you going?" description="This helps AERA coach you without generic motivation." backHref="/onboarding/nutrition" action={saveMotivation}>
    <Choice name="motivation" value="health" required>Feel healthier</Choice><Choice name="motivation" value="confidence" required>Build confidence</Choice><Choice name="motivation" value="performance" required>Improve performance</Choice><Choice name="motivation" value="energy" required>Have more energy</Choice><Choice name="motivation" value="consistency" required>Become consistent</Choice>
  </OnboardingFrame>;
}

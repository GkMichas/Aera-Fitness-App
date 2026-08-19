import { Choice, Field, OnboardingFrame } from "@/components/onboarding-screen";
import { saveGoal } from "@/app/onboarding/actions";

const goals = [["lose_fat", "Lose fat"], ["build_muscle", "Build muscle"], ["get_stronger", "Get stronger"], ["improve_fitness", "Improve fitness"], ["maintain_weight", "Maintain weight"], ["body_recomposition", "Body recomposition"]] as const;

export default function Page() {
  return <OnboardingFrame step={2} title="What do you want to achieve?" description="Pick one primary goal. You can add secondary goals after." backHref="/onboarding/welcome" action={saveGoal}>
    <div className="flex flex-col gap-2.5">{goals.map(([value, label]) => <Choice key={value} name="primaryGoal" value={value} required>{label}</Choice>)}</div>
    <Field label="Target weight (optional)" name="targetWeightKg" type="number" min={25} max={400} step={0.1} />
    <Field label="Target date (optional)" name="targetDate" type="date" />
  </OnboardingFrame>;
}

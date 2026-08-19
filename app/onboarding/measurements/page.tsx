import { Field, OnboardingFrame } from "@/components/onboarding-screen";
import { saveMeasurements } from "@/app/onboarding/actions";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <OnboardingFrame step={4} title="Body measurements" description="Optional. You can update these whenever you want." backHref="/onboarding/about" action={saveMeasurements} error={error}>
    <div className="grid grid-cols-2 gap-3"><Field label="Waist (cm)" name="waistCm" type="number" step={0.1} /><Field label="Neck (cm)" name="neckCm" type="number" step={0.1} /><Field label="Chest (cm)" name="chestCm" type="number" step={0.1} /><Field label="Arm (cm)" name="armCm" type="number" step={0.1} /><Field label="Thigh (cm)" name="thighCm" type="number" step={0.1} /><Field label="Calf (cm)" name="calfCm" type="number" step={0.1} /></div>
  </OnboardingFrame>;
}

import { Choice, Field, OnboardingFrame } from "@/components/onboarding-screen";
import { saveTraining } from "@/app/onboarding/actions";

export default function Page() {
  return <OnboardingFrame step={7} title="Your training setup" description="AERA only plans exercises you can actually perform." backHref="/onboarding/activity" action={saveTraining}>
    <p className="text-xs font-semibold uppercase tracking-[.1em] text-black/50">Location</p>
    <div className="grid grid-cols-2 gap-2"><Choice type="checkbox" name="trainingLocations" value="home">Home</Choice><Choice type="checkbox" name="trainingLocations" value="gym">Gym</Choice><Choice type="checkbox" name="trainingLocations" value="outdoors">Outdoors</Choice><Choice type="checkbox" name="trainingLocations" value="mixed">Mixed</Choice></div>
    <p className="text-xs font-semibold uppercase tracking-[.1em] text-black/50">Equipment</p>
    <div className="grid grid-cols-2 gap-2"><Choice type="checkbox" name="equipment" value="none">None</Choice><Choice type="checkbox" name="equipment" value="dumbbells">Dumbbells</Choice><Choice type="checkbox" name="equipment" value="bands">Bands</Choice><Choice type="checkbox" name="equipment" value="barbell">Barbell</Choice><Choice type="checkbox" name="equipment" value="full_gym">Full gym</Choice></div>
    <div className="grid grid-cols-2 gap-3"><Field label="Days / week" name="trainingDays" type="number" min={1} max={7} required /><Field label="Minutes" name="sessionDuration" type="number" min={10} max={180} required /></div>
  </OnboardingFrame>;
}

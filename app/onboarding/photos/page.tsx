import { OnboardingFrame, labelClass } from "@/components/onboarding-screen";
import { savePhotos } from "@/app/onboarding/actions";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <OnboardingFrame step={5} title="Progress photos" description="Optional and private by default. JPG, PNG or WebP, up to 10MB each." backHref="/onboarding/measurements" action={savePhotos} submitLabel="Save and continue" error={error}>
    {(["front", "side", "back"] as const).map((view) => <label key={view} className="flex flex-col gap-2"><span className={labelClass}>{view}</span><input className="rounded-xl border border-dashed border-black/25 bg-white p-4 text-sm" type="file" name={view} accept="image/jpeg,image/png,image/webp" /></label>)}
  </OnboardingFrame>;
}

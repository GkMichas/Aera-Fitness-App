import { ProgressPhotoLibrary } from "@/components/progress-photo-library";
import { loadProgressDashboard } from "@/lib/progress/source";

export default async function Page() {
  const data = await loadProgressDashboard();
  return <ProgressPhotoLibrary photos={data.photos} isDemo={data.isDemo} />;
}

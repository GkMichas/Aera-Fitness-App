import { ProgressDashboard } from "@/components/progress-dashboard";
import { loadProgressDashboard } from "@/lib/progress/source";

export default async function Page() {
  return <ProgressDashboard data={await loadProgressDashboard()} />;
}

import { MeasurementsDashboard } from "@/components/measurements-dashboard";
import { loadProgressDashboard } from "@/lib/progress/source";

export default async function Page() {
  const data = await loadProgressDashboard();
  return <MeasurementsDashboard initialMeasurements={data.measurements} isDemo={data.isDemo} />;
}

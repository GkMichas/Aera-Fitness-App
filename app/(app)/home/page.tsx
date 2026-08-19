import { CheckInCard, InsightCard, MetricsStrip, TodayPlan } from "@/components/home";
import { PageTitle } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      <PageTitle title="Good morning, George" subtitle="Here's your plan for today." />
      <MetricsStrip />
      <InsightCard />
      <TodayPlan />
      <CheckInCard />
    </>
  );
}

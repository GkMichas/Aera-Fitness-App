import { WeeklyReview } from "@/components/weekly-review";
import { loadWeeklyReview } from "@/lib/progress/source";

export default async function Page() {
  const { review, isDemo } = await loadWeeklyReview();
  return <WeeklyReview review={review} isDemo={isDemo} />;
}

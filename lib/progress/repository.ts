import type { ProgressDashboardData, WeeklyReviewInput, WeeklyReviewResult } from "@/types/progress";

export interface ProgressRepository {
  getDashboard(userId: string): Promise<ProgressDashboardData>;
  getWeeklyInput(userId: string, weekStart: string): Promise<WeeklyReviewInput>;
  saveWeeklyReview(userId: string, result: WeeklyReviewResult, input: WeeklyReviewInput): Promise<string>;
}

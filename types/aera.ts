export type TrendDirection = "up" | "down" | "flat";

export interface Metric {
  label: string;
  value: string;
  note: string;
  tone?: "neutral" | "positive" | "recovery" | "warning";
  progress?: number;
}

export interface TodayPlan {
  training: {
    title: string;
    duration: string;
    meta: string;
    image: string;
  };
  nutrition: {
    calories: number;
    protein: number;
    remainingCalories: number;
    remainingProtein: number;
  };
}

export interface DemoUser {
  name: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  primaryGoal: string;
  secondaryGoal: string;
  plan: TodayPlan;
  metrics: Metric[];
}

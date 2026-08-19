export interface MeasurementPoint {
  date: string;
  weightKg?: number;
  waistCm?: number;
  neckCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  calfCm?: number;
}

export interface StrengthPoint { date: string; exercise: string; estimatedOneRepMaxKg: number; }
export interface ConsistencyPoint { weekStart: string; completed: number; planned: number; }
export interface NutritionAdherencePoint { weekStart: string; adherencePercent: number; }
export interface ProgressPhoto { id: string; view: "front" | "side" | "back"; capturedOn: string; url?: string; isDemo?: boolean; }

export interface ProgressDashboardData {
  measurements: MeasurementPoint[];
  strength: StrengthPoint[];
  training: ConsistencyPoint[];
  nutrition: NutritionAdherencePoint[];
  photos: ProgressPhoto[];
  targetWeightKg?: number;
  isDemo: boolean;
}

export interface WeeklyReviewInput {
  weekStart: string;
  weekEnd: string;
  startMeasurement?: MeasurementPoint;
  endMeasurement?: MeasurementPoint;
  completedWorkouts: number;
  plannedWorkouts: number;
  dailyCalories: number[];
  calorieTarget?: number;
  sleepMinutes: number[];
  strengthChangePercent?: number;
}

export interface WeeklyReviewResult {
  weekStart: string;
  weekEnd: string;
  weightChangeKg?: number;
  waistChangeCm?: number;
  trainingAdherencePercent?: number;
  nutritionAdherencePercent?: number;
  averageSleepMinutes?: number;
  title: string;
  insight: string;
  recommendation: string;
  evidence: string[];
  rulesVersion: "aera-progress-v1";
}

export type ProgressMetric = "weight" | "waist" | "strength" | "training" | "nutrition";

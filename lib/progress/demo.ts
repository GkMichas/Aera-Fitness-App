import { estimatedOneRepMax, generateWeeklyReview } from "@/lib/progress/calculations";
import type { ProgressDashboardData, WeeklyReviewInput } from "@/types/progress";

export const demoProgressData: ProgressDashboardData = {
  isDemo: true,
  targetWeightKg: 86,
  measurements: [
    { date: "2026-05-18", weightKg: 83.8, waistCm: 87.4, neckCm: 40, chestCm: 103.2, armCm: 34.1, thighCm: 58.1 },
    { date: "2026-06-01", weightKg: 84, waistCm: 87 },
    { date: "2026-06-15", weightKg: 83.9, waistCm: 86.8 },
    { date: "2026-06-29", weightKg: 84.1, waistCm: 86.2 },
    { date: "2026-07-13", weightKg: 84, waistCm: 85.8 },
    { date: "2026-07-27", weightKg: 84.1, waistCm: 85.5 },
    { date: "2026-08-04", weightKg: 84, waistCm: 85.2, neckCm: 40, chestCm: 103.8, armCm: 34.3, thighCm: 58.2 },
    { date: "2026-08-11", weightKg: 84.1, waistCm: 84.9, neckCm: 40, chestCm: 104, armCm: 34.4, thighCm: 58.2 },
    { date: "2026-08-18", weightKg: 84.2, waistCm: 84.6, neckCm: 40, chestCm: 104.1, armCm: 34.5, thighCm: 58.3 },
  ],
  strength: [
    { date: "2026-05-20", exercise: "Dumbbell bench press", estimatedOneRepMaxKg: estimatedOneRepMax(22, 8) },
    { date: "2026-06-17", exercise: "Dumbbell bench press", estimatedOneRepMaxKg: estimatedOneRepMax(23, 8) },
    { date: "2026-07-15", exercise: "Dumbbell bench press", estimatedOneRepMaxKg: estimatedOneRepMax(24, 8) },
    { date: "2026-08-17", exercise: "Dumbbell bench press", estimatedOneRepMaxKg: estimatedOneRepMax(25, 8) },
  ],
  training: [
    { weekStart: "2026-07-27", completed: 3, planned: 4 },
    { weekStart: "2026-08-03", completed: 4, planned: 4 },
    { weekStart: "2026-08-10", completed: 4, planned: 4 },
    { weekStart: "2026-08-17", completed: 3, planned: 4 },
  ],
  nutrition: [
    { weekStart: "2026-07-27", adherencePercent: 82 },
    { weekStart: "2026-08-03", adherencePercent: 87 },
    { weekStart: "2026-08-10", adherencePercent: 89 },
    { weekStart: "2026-08-17", adherencePercent: 91 },
  ],
  photos: [
    { id: "demo-front-may", view: "front", capturedOn: "2026-05-18", isDemo: true, url: "/media/progress/demo-front-diptych.jpg" },
    { id: "demo-front-aug", view: "front", capturedOn: "2026-08-18", isDemo: true, url: "/media/progress/demo-front-diptych.jpg" },
    { id: "demo-side-may", view: "side", capturedOn: "2026-05-18", isDemo: true, url: "/media/progress/demo-side-diptych.jpg" },
    { id: "demo-side-aug", view: "side", capturedOn: "2026-08-18", isDemo: true, url: "/media/progress/demo-side-diptych.jpg" },
  ],
};

export const demoWeeklyInput: WeeklyReviewInput = {
  weekStart: "2026-08-12",
  weekEnd: "2026-08-18",
  startMeasurement: { date: "2026-08-11", weightKg: 84.1, waistCm: 84.9 },
  endMeasurement: { date: "2026-08-18", weightKg: 84.2, waistCm: 84.6 },
  completedWorkouts: 4,
  plannedWorkouts: 4,
  dailyCalories: [2180, 2260, 2215, 2300, 2160, 2245, 2200],
  calorieTarget: 2240,
  sleepMinutes: [405, 420, 390, 430, 410, 415, 400],
  strengthChangePercent: 1.8,
};

export const demoWeeklyReview = generateWeeklyReview(demoWeeklyInput);

import type { DemoUser } from "@/types/aera";

export const demoUser: DemoUser = {
  name: "George",
  age: 34,
  heightCm: 170,
  currentWeightKg: 84.2,
  targetWeightKg: 75,
  primaryGoal: "Lose fat",
  secondaryGoal: "Build muscle",
  metrics: [
    { label: "Weight", value: "84.2 kg", note: "↓ 0.2 kg this week", tone: "positive" },
    { label: "Sleep", value: "7h 12m", note: "7h 30m target", tone: "recovery" },
    { label: "Energy", value: "7/10", note: "from check-in" },
    { label: "Recovery", value: "82%", note: "sleep + soreness", tone: "positive" },
    { label: "Steps", value: "4,821", note: "8,000 target", progress: 60 },
  ],
  plan: {
    training: {
      title: "Upper Body",
      duration: "45 min",
      meta: "5 exercises · dumbbells",
      image: "/media/training/dumbbell-row.jpg",
    },
    nutrition: {
      calories: 2190,
      protein: 168,
      remainingCalories: 820,
      remainingProtein: 56,
    },
  },
};

export const navItems = [
  { href: "/home", label: "Home" },
  { href: "/coach", label: "Coach" },
  { href: "/training", label: "Training" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/you", label: "You" },
];

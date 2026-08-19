type Sex = "male" | "female" | "other" | "prefer_not_to_say";

const activityFactors: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

export function calculateBmr({ weightKg, heightCm, age, sex }: { weightKg: number; heightCm: number; age: number; sex: Sex }) {
  const sexAdjustment = sex === "male" ? 5 : sex === "female" ? -161 : -78;
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + sexAdjustment);
}

export function calculateInitialTargets({ weightKg, heightCm, age, sex, activityLevel, goal }: { weightKg: number; heightCm: number; age: number; sex: Sex; activityLevel: string; goal: string }) {
  const bmr = calculateBmr({ weightKg, heightCm, age, sex });
  const tdee = Math.round(bmr * (activityFactors[activityLevel] ?? activityFactors.sedentary));
  const calorieAdjustment = goal === "lose_fat" || goal === "body_recomposition" ? -400 : goal === "build_muscle" ? 250 : goal === "get_stronger" ? 150 : 0;
  const calories = Math.max(1200, Math.round((tdee + calorieAdjustment) / 10) * 10);
  const proteinMultiplier = ["lose_fat", "body_recomposition", "build_muscle"].includes(goal) ? 2 : 1.6;
  const proteinGrams = Math.round(weightKg * proteinMultiplier);
  return { bmr, tdee, calories, proteinGrams };
}

export function ageFromBirthDate(birthDate: string | null) {
  if (!birthDate) return 30;
  const born = new Date(`${birthDate}T00:00:00Z`);
  const today = new Date();
  let age = today.getUTCFullYear() - born.getUTCFullYear();
  const birthdayPassed = today.getUTCMonth() > born.getUTCMonth() || (today.getUTCMonth() === born.getUTCMonth() && today.getUTCDate() >= born.getUTCDate());
  if (!birthdayPassed) age -= 1;
  return Math.max(18, age);
}

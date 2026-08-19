import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const routes = {
  "app/page.tsx": "Landing",
  "app/(app)/check-in/page.tsx": "Daily Check-in",
  "app/(app)/coach/page.tsx": "Coach",
  "app/(app)/training/page.tsx": "Training",
  "app/(app)/training/active/page.tsx": "Active Workout",
  "app/(app)/nutrition/page.tsx": "Nutrition",
  "app/(app)/nutrition/plan/page.tsx": "Meal Plan",
  "app/(app)/progress/page.tsx": "Progress",
  "app/(app)/weekly-review/page.tsx": "Weekly Review",
  "app/(app)/health/page.tsx": "AERA Health",
  "app/(app)/training/workout/page.tsx": "Workout Detail",
  "app/(app)/training/exercise/page.tsx": "Exercise Detail",
  "app/(app)/nutrition/log/page.tsx": "Meal Logging",
  "app/(app)/measurements/page.tsx": "Measurements",
  "app/(app)/goals/page.tsx": "Goals",
  "app/(app)/you/page.tsx": "Profile",
  "app/(app)/home/empty/page.tsx": "Empty state",
  "app/(app)/loading/page.tsx": "Loading",
  "app/(app)/coach/error/page.tsx": "Error",
};

for (const [relativePath, name] of Object.entries(routes)) {
  const path = resolve(root, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    `import { ReferenceScreen } from "@/components/reference-screen";\n\nexport default function Page() {\n  return <ReferenceScreen name=${JSON.stringify(name)} />;\n}\n`,
  );
}

console.log(`Installed ${Object.keys(routes).length} pixel-perfect routes.`);

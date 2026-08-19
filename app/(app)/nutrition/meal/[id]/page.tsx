import { notFound } from "next/navigation";
import { MealDetail } from "@/components/meal-detail";
import { demoRecipes, getRecipe } from "@/lib/nutrition/demo";

export function generateStaticParams() {
  return demoRecipes.map((recipe) => ({ id: recipe.id }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();
  return <MealDetail recipe={recipe} />;
}

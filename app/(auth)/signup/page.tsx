import { SignupScreen } from "@/components/auth-screen";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return <SignupScreen error={params.error} isLocalMode={!hasSupabaseEnv()} />;
}

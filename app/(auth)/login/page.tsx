import { LoginScreen } from "@/components/auth-screen";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const params = await searchParams;
  return <LoginScreen {...params} isLocalMode={!hasSupabaseEnv()} />;
}

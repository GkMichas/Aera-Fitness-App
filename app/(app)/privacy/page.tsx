import { PrivacyCenter } from "@/components/privacy-center";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export default function Page() {
  return <PrivacyCenter isLocalMode={!hasSupabaseEnv()} />;
}

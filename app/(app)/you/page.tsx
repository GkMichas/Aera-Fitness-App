import { ProfileDashboard } from "@/components/profile-dashboard";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export default function Page() {
  return <ProfileDashboard isLocalMode={!hasSupabaseEnv()} />;
}

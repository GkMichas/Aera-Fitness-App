import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next") ?? "/home";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/home";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: profile } = await supabase.from("profiles").select("onboarding_completed_at").maybeSingle();
      const destination = next === "/home" && !profile?.onboarding_completed_at ? "/onboarding/welcome" : next;
      return NextResponse.redirect(new URL(destination, url.origin));
    }
  }

  const login = new URL("/login", url.origin);
  login.searchParams.set("error", "The authentication link is invalid or expired.");
  return NextResponse.redirect(login);
}

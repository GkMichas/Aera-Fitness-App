"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function messageUrl(path: string, kind: "error" | "message", message: string) {
  const params = new URLSearchParams({ [kind]: message });
  return `${path}?${params}`;
}

export async function login(formData: FormData) {
  const email = value(formData, "email");
  const password = value(formData, "password");
  const next = value(formData, "next");

  if (!email || !password) {
    redirect(messageUrl("/login", "error", "Enter your email and password."));
  }

  let authError: string | undefined;
  let onboardingComplete = false;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    authError = error?.message;
    if (!error) {
      const { data } = await supabase.from("profiles").select("onboarding_completed_at").maybeSingle();
      onboardingComplete = Boolean(data?.onboarding_completed_at);
    }
  } catch (error) {
    redirect(
      messageUrl(
        "/login",
        "error",
        error instanceof Error ? error.message : "Could not sign in.",
      ),
    );
  }

  if (authError) redirect(messageUrl("/login", "error", authError));

  if (next.startsWith("/") && !next.startsWith("//")) redirect(next);
  redirect(onboardingComplete ? "/home" : "/onboarding/welcome");
}

export async function signup(formData: FormData) {
  const firstName = value(formData, "firstName");
  const email = value(formData, "email");
  const password = value(formData, "password");

  if (!firstName || !email || password.length < 8) {
    redirect(
      messageUrl(
        "/signup",
        "error",
        "Enter your name, a valid email and a password of at least 8 characters.",
      ),
    );
  }

  let hasSession = false;
  let authError: string | undefined;
  try {
    const origin = (await headers()).get("origin") ?? "http://localhost:3000";
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName },
        emailRedirectTo: `${origin}/auth/callback?next=/onboarding/welcome`,
      },
    });

    authError = error?.message;
    hasSession = Boolean(data.session);
  } catch (error) {
    redirect(
      messageUrl(
        "/signup",
        "error",
        error instanceof Error ? error.message : "Could not create the account.",
      ),
    );
  }

  if (authError) redirect(messageUrl("/signup", "error", authError));
  if (hasSession) redirect("/onboarding/welcome");

  redirect(
    messageUrl(
      "/login",
      "message",
      "Check your email to confirm your account, then sign in.",
    ),
  );
}

export async function signInWithGoogle() {
  let providerUrl: string | null = null;
  let authError: string | undefined;
  try {
    const origin = (await headers()).get("origin") ?? "http://localhost:3000";
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?next=/home` },
    });
    authError = error?.message;
    providerUrl = data.url;
  } catch (error) {
    redirect(
      messageUrl(
        "/login",
        "error",
        error instanceof Error ? error.message : "Google sign-in failed.",
      ),
    );
  }


  if (authError) redirect(messageUrl("/login", "error", authError));
  if (providerUrl) redirect(providerUrl);

  redirect(messageUrl("/login", "error", "Google sign-in did not return a URL."));
}

export async function requestPasswordReset(formData: FormData) {
  const email = value(formData, "email");
  if (!email) redirect(messageUrl("/login", "error", "Enter your email first."));

  let authError: string | undefined;
  try {
    const origin = (await headers()).get("origin") ?? "http://localhost:3000";
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/auth/reset`,
    });
    authError = error?.message;
  } catch (error) {
    redirect(
      messageUrl(
        "/login",
        "error",
        error instanceof Error ? error.message : "Password reset failed.",
      ),
    );
  }


  if (authError) redirect(messageUrl("/login", "error", authError));

  redirect(messageUrl("/login", "message", "Password reset email sent."));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updatePassword(formData: FormData) {
  const password = value(formData, "password");
  if (password.length < 8) {
    redirect(messageUrl("/auth/reset", "error", "Use at least 8 characters."));
  }

  let authError: string | undefined;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    authError = error?.message;
  } catch (error) {
    redirect(
      messageUrl(
        "/auth/reset",
        "error",
        error instanceof Error ? error.message : "Could not update the password.",
      ),
    );
  }

  if (authError) redirect(messageUrl("/auth/reset", "error", authError));
  redirect(messageUrl("/login", "message", "Password updated. You can sign in now."));
}

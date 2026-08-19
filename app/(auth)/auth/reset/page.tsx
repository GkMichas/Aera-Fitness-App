import Link from "next/link";
import { updatePassword } from "@/app/(auth)/actions";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--aera-ivory)] p-5">
      <section className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-sm">
        <p className="text-sm font-bold tracking-[.16em]">AERA</p>
        <h1 className="mt-8 text-3xl font-bold tracking-[-.025em]">Choose a new password.</h1>
        {error ? <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-[var(--aera-critical)]">{error}</p> : null}
        <form action={updatePassword} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2"><span className="text-xs font-semibold uppercase tracking-[.1em] text-black/50">New password</span><input className="min-h-[52px] rounded-lg border border-black/15 px-4" type="password" name="password" minLength={8} autoComplete="new-password" required /></label>
          <button className="min-h-[52px] rounded-lg bg-[var(--aera-terracotta)] font-semibold text-white" type="submit">Update password</button>
        </form>
        <Link className="mt-5 inline-block text-sm font-semibold text-[#B24A34]" href="/login">Back to sign in</Link>
      </section>
    </main>
  );
}

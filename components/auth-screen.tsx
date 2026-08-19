import Link from "next/link";
import {
  login,
  requestPasswordReset,
  signInWithGoogle,
  signup,
} from "@/app/(auth)/actions";

const inputClass =
  "min-h-[52px] appearance-none rounded-lg border border-black/15 bg-white px-4 py-[15px] text-base text-[var(--aera-ink)] outline-none";
const labelClass =
  "text-xs font-semibold uppercase tracking-[.1em] text-black/50";

function StatusMessage({ error, message }: { error?: string; message?: string }) {
  const text = error ?? message;
  if (!text) return null;
  return (
    <p role={error ? "alert" : "status"} className={`rounded-lg px-4 py-3 text-sm leading-5 ${error ? "bg-red-50 text-[var(--aera-critical)]" : "bg-emerald-50 text-[var(--aera-forest)]"}`}>
      {text}
    </p>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="reference-stage">
      <div className="flex h-[844px] w-[390px] flex-none flex-col overflow-hidden rounded-[40px] border border-black/15 bg-[var(--aera-ivory)] shadow-[0_12px_32px_rgba(23,23,23,.08)] max-[453px]:rounded-none max-[453px]:border-0 max-[453px]:shadow-none">
        <div className="flex h-[46px] flex-none items-center justify-between px-[26px] text-[13px] font-semibold" aria-hidden="true">
          <span>9:41</span><span>ᯤ&nbsp;&nbsp;⏻</span>
        </div>
        {children}
      </div>
    </main>
  );
}

export function LoginScreen({ error, message, next = "", isLocalMode = false }: { error?: string; message?: string; next?: string; isLocalMode?: boolean }) {
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 pb-7 pt-1">
        <span className="text-xl font-bold tracking-[.16em]">AERA</span>
        <div>
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-.025em]">Welcome back.</h1>
          <p className="mt-2 text-[15px] text-black/60">Your plan is where you left it.</p>
        </div>
        <StatusMessage error={error} message={message} />
        {isLocalMode && <div className="rounded-xl border border-black/10 bg-white p-4"><p className="text-sm font-bold">Local demo is ready</p><p className="mt-1 text-xs leading-5 text-black/50">No account is required. Changes stay in this browser.</p><Link href="/home" className="mt-3 flex min-h-11 items-center justify-center rounded-lg bg-[var(--aera-forest)] text-sm font-bold text-white">Open AERA</Link></div>}
        <form action={login} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Email</span>
            <input className={inputClass} type="email" name="email" autoComplete="email" required />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Password</span>
            <input className={inputClass} type="password" name="password" autoComplete="current-password" required />
          </label>
          <button className="mt-2 min-h-[52px] rounded-lg bg-[var(--aera-terracotta)] px-4 py-4 text-base font-semibold text-white" type="submit">Sign In</button>
          <button formAction={requestPasswordReset} className="text-left text-sm font-semibold text-[#B24A34]" type="submit">Forgot password?</button>
        </form>
        <div className="flex items-center gap-3.5"><span className="h-px flex-1 bg-black/15" /><span className="text-[13px] text-black/45">or</span><span className="h-px flex-1 bg-black/15" /></div>
        <form action={signInWithGoogle}>
          <button className="min-h-[52px] w-full rounded-lg border border-black/15 bg-white px-4 py-4 text-base font-semibold" type="submit">Continue with Google</button>
        </form>
        <div className="mt-auto flex justify-center gap-2 text-[15px]"><span className="text-black/60">New to AERA?</span><Link className="font-semibold text-[#B24A34]" href="/signup">Create Account</Link></div>
      </div>
    </PhoneFrame>
  );
}

export function SignupScreen({ error, isLocalMode = false }: { error?: string; isLocalMode?: boolean }) {
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 pb-7 pt-1">
        <Link href="/login" aria-label="Back to login" className="text-[22px] text-black/60">←</Link>
        <div>
          <h1 className="max-w-[16ch] text-[32px] font-bold leading-[1.1] tracking-[-.025em]">Three fields, then your plan.</h1>
          <p className="mt-2 text-[15px] text-black/60">Onboarding takes about four minutes.</p>
        </div>
        <StatusMessage error={error} />
        {isLocalMode && <Link href="/home" className="flex min-h-11 items-center justify-center rounded-lg bg-[var(--aera-forest)] text-sm font-bold text-white">Use local demo instead</Link>}
        <form action={signup} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2"><span className={labelClass}>First name</span><input className={inputClass} name="firstName" autoComplete="given-name" required /></label>
          <label className="flex flex-col gap-2"><span className={labelClass}>Email</span><input className={inputClass} type="email" name="email" autoComplete="email" required /></label>
          <label className="flex flex-col gap-2"><span className={labelClass}>Password</span><input className={inputClass} type="password" name="password" autoComplete="new-password" minLength={8} required /><span className="text-[13px] text-black/50">At least 8 characters.</span></label>
          <button className="min-h-[52px] rounded-lg bg-[var(--aera-terracotta)] px-4 py-4 text-base font-semibold text-white" type="submit">Create Account</button>
        </form>
        <p className="text-[13px] leading-[1.5] text-black/50">Your measurements and photos stay private to your account. You can delete everything at any time.</p>
      </div>
    </PhoneFrame>
  );
}

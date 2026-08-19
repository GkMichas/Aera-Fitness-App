import { Eyebrow, PageTitle } from "@/components/ui";

export default function CoachPage() {
  return (
    <div className="max-w-4xl">
      <PageTitle title="AERA" subtitle="Your personal coach." />
      <div className="mt-8 space-y-4">
        <div className="ml-auto max-w-[78%] rounded-2xl bg-[var(--aera-stone)] p-4 text-[16px]">My legs are sore. Should I still train today?</div>
        <div className="max-w-[82%] rounded-2xl border border-black/10 bg-white p-5">
          <Eyebrow tone="forest">AERA</Eyebrow>
          <p className="mt-3 leading-7">Your soreness is moderate and mostly in your quads, while today's session is upper body. With recovery at 82%, keep the session but avoid adding extra lower-body volume.</p>
          <button className="mt-5 min-h-11 rounded-lg border border-black/20 bg-[var(--aera-ivory)] px-4 font-semibold">View today's workout</button>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-black/15 bg-white p-3"><label htmlFor="coach-message" className="sr-only">Message AERA</label><textarea id="coach-message" className="min-h-24 w-full resize-none bg-transparent p-2 outline-none" placeholder="Ask AERA anything about your plan…" /><div className="flex justify-end"><button className="min-h-11 rounded-lg bg-[var(--aera-terracotta)] px-5 font-bold text-white">Send</button></div></div>
    </div>
  );
}

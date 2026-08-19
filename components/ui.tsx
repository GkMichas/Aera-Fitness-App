import Link from "next/link";

export function Eyebrow({ children, tone = "terracotta" }: { children: React.ReactNode; tone?: "terracotta" | "forest" | "blue" }) {
  const colors = { terracotta: "text-[var(--aera-terracotta)]", forest: "text-[var(--aera-forest)]", blue: "text-[var(--aera-recovery-blue)]" };
  return <div className={`text-[11px] font-bold uppercase tracking-[0.16em] ${colors[tone]}`}>{children}</div>;
}

export function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--aera-terracotta)] px-6 text-[16px] font-bold text-white transition hover:brightness-95">{children}</Link>;
}

export function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-black/25 bg-white px-6 text-[16px] font-bold transition hover:bg-black/[.03]">{children}</Link>;
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <header><h1 className="text-[38px] font-black leading-[.98] tracking-[-0.045em] sm:text-[52px]">{title}</h1>{subtitle ? <p className="mt-3 max-w-2xl text-[17px] text-black/52">{subtitle}</p> : null}</header>;
}

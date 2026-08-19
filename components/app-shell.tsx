"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/demo-data";

function DesktopSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[292px] border-r border-[var(--aera-border)] bg-[var(--aera-ivory)] px-6 py-8 lg:flex lg:flex-col">
      <div>
        <Link href="/home" className="text-[27px] font-black tracking-[-0.04em]">AERA</Link>
        <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.18em] text-black/50">George · AERA Pro</p>
      </div>
      <nav className="mt-12 flex flex-col gap-1" aria-label="Primary">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`min-h-11 rounded-lg px-3 py-2.5 text-[17px] font-medium transition ${active ? "bg-white text-[var(--aera-terracotta)] shadow-sm" : "hover:bg-white/70"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="my-6 border-t border-black/30" />
      <nav className="flex flex-col gap-1" aria-label="Secondary">
        <Link className="min-h-11 rounded-lg px-3 py-2.5 text-[15px] hover:bg-white/70" href="/weekly-review">Weekly review</Link>
        <Link className="min-h-11 rounded-lg px-3 py-2.5 text-[15px] hover:bg-white/70" href="/health">AERA Health</Link>
      </nav>
      <div className="mt-auto rounded-xl border border-[var(--aera-border)] bg-white p-4 text-sm">
        <p className="font-semibold">Stage 1 build</p>
        <p className="mt-1 text-black/55">Production shell + design system + core journey.</p>
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--aera-border)] bg-[rgba(247,245,241,.96)] px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden" aria-label="Primary">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return <Link key={item.href} href={item.href} className={`flex min-h-12 items-center justify-center rounded-lg text-xs font-semibold ${active ? "text-[var(--aera-terracotta)]" : "text-black/55"}`}>{item.label}</Link>;
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--aera-ivory)]">
      <DesktopSidebar />
      <main className="min-h-screen pb-24 lg:ml-[292px] lg:pb-0">
        <div className="mx-auto w-full max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</div>
      </main>
      <MobileBottomNav />
    </div>
  );
}

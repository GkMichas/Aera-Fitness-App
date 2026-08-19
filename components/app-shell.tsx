"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Dumbbell,
  HeartPulse,
  House,
  LogOut,
  MessageCircle,
  Utensils,
  UserRound,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";

const primary = [
  { href: "/home", label: "Home", icon: House },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/training", label: "Training", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Utensils },
  { href: "/you", label: "You", icon: UserRound },
] as const;

const secondary = [
  { href: "/weekly-review", label: "Weekly review", icon: CalendarDays },
  { href: "/health", label: "AERA Health", icon: HeartPulse },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopSidebar({ isLocalMode }: { isLocalMode: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[292px] flex-col border-r border-black/10 bg-[var(--aera-ivory)] px-7 py-8 lg:flex">
      <Link href="/home" className="text-[27px] font-bold tracking-[.16em]">
        AERA
      </Link>
      <p className="mt-3 text-[12px] font-semibold uppercase tracking-[.14em] text-black/45">
        George · {isLocalMode ? "Local demo" : "AERA Pro"}
      </p>

      <nav className="mt-12 flex flex-col gap-1" aria-label="Primary navigation">
        {primary.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={`flex min-h-12 items-center gap-3 rounded-lg px-3 text-[15px] font-semibold transition-colors ${
              isActive(pathname, href)
                ? "bg-white text-[var(--aera-terracotta)]"
                : "text-black/65 hover:bg-white/70 hover:text-black"
            }`}
          >
            <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="my-6 border-t border-black/15" />

      <nav className="flex flex-col gap-1" aria-label="Secondary navigation">
        {secondary.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-[14px] font-medium text-black/55 transition-colors hover:bg-white/70 hover:text-black"
          >
            <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-black/15 pt-5">
        <Link href="/you" className="flex min-w-0 flex-1 items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[var(--aera-stone)] text-sm font-bold">G</span>
          <span><span className="block text-sm font-semibold">George</span><span className="block text-xs text-black/45">View profile</span></span>
        </Link>
        {!isLocalMode && <form action={logout} className="ml-auto">
          <button type="submit" aria-label="Sign out" className="grid size-10 place-items-center rounded-lg text-black/45 hover:bg-white hover:text-black">
            <LogOut aria-hidden="true" size={18} />
          </button>
        </form>}
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-black/10 bg-white px-2 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 lg:hidden" aria-label="Primary navigation">
      {primary.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] ${active ? "font-semibold text-black" : "text-black/50"}`}
          >
            <Icon aria-hidden="true" size={21} strokeWidth={active ? 2.3 : 1.7} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileStatusBar() {
  return (
    <div className="flex h-[46px] items-center justify-between px-[26px] text-[13px] font-semibold lg:hidden">
      <span>9:41</span>
      <span>ᯤ&nbsp;&nbsp;⏻</span>
    </div>
  );
}

export function AppShell({ children, isLocalMode }: { children: React.ReactNode; isLocalMode: boolean }) {
  return (
    <div className="min-h-dvh bg-[var(--aera-ivory)]">
      <DesktopSidebar isLocalMode={isLocalMode} />
      <main className="min-h-dvh pb-24 lg:ml-[292px] lg:pb-0">
        <MobileStatusBar />
        <div className="mx-auto w-full max-w-[1320px] px-5 pb-8 pt-1 sm:px-8 lg:px-12 lg:py-10 xl:px-16">
          {isLocalMode && <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-black/10 bg-white/75 px-4 py-2 text-[11px] text-black/55"><span><strong className="text-black">Local mode</strong> · Changes stay on this device</span><Link href="/privacy" className="font-bold text-[var(--aera-terracotta)]">Manage data</Link></div>}
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}

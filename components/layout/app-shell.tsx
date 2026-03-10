// components/layout/app-shell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Swords, Trophy, User, Sparkles } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Arena", href: "/arena", icon: Swords },
  { label: "Cards", href: "/cards", icon: Sparkles },
  { label: "Ranks", href: "/leaderboard", icon: Trophy },
  { label: "Profile", href: "/profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#060816] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-120px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-[-60px] h-[240px] w-[240px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-40px] top-[25%] h-[260px] w-[260px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl">
        {/* Desktop Sidebar */}
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-white/[0.03] backdrop-blur-xl lg:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
              Zodiac Clash
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Player Console
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Cosmic battler dashboard
            </p>
          </div>

          <nav className="flex-1 px-4 py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 transition",
                      active
                        ? "border-cyan-400/30 bg-cyan-400/10 text-white shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                        : "border-transparent bg-transparent text-white/65 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-fuchsia-200/70">
                Season Role
              </p>
              <p className="mt-2 text-lg font-semibold">Genesis #014</p>
              <p className="mt-1 text-sm text-white/60">
                Founding fighter of Zodiac Clash
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Mobile Topbar */}
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060816]/80 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
                  Zodiac Clash
                </p>
                <h1 className="mt-1 text-lg font-semibold">Player Console</h1>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/75">
                Genesis
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#08101f]/90 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 py-3 text-[11px] transition",
                  active ? "text-cyan-300" : "text-white/55"
                )}
              >
                <Icon className={clsx("h-5 w-5", active && "drop-shadow-[0_0_10px_rgba(34,211,238,0.45)]")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
"use client";

import { AppShell } from "../../components/layout/app-shell";
import { SectionCard } from "../../components/shared/section-card";
import { StatPill } from "../../components/shared/stat-pill";
import { ArenaActionCard } from "../../components/arena/arena-action-card";
import { Flame, Shield, Swords } from "lucide-react";
import { useCurrentPlayer } from "../../hooks/use-current-player";

export default function ArenaPage() {
  const { player, loading, error, isTelegram } = useCurrentPlayer();

  const wins = player?.wins ?? 0;
  const losses = player?.losses ?? 0;
  const battles = player?.battles ?? 0;
  const winRate = player?.winRate ?? 0;
  const streak = player?.streak ?? 0;
  const stardust = player?.stardust ?? 0;
  const fighterName = player?.name ?? "Origin Fighter";
  const zodiac = player?.zodiac ?? "Unknown";
  const archetype = player?.archetype ?? "Unassigned";

  const status =
    battles > 0 ? "Arena Ready" : "First Battle Awaits";
  const arenaPulse =
    battles > 0
      ? "Your fighter is battle-tested and ready for the next ranked challenge."
      : "Your fighter has not entered the arena yet. Start your first battle to begin your climb.";

  const quickActions = [
    {
      title: "Enter Ranked",
      subtitle: "Take your current fighter into the live ladder.",
      value: `${wins} Wins`,
    },
    {
      title: "Protect Streak",
      subtitle: "Keep momentum high and avoid dropping your current run.",
      value: `${streak}W Streak`,
    },
    {
      title: "Use Stardust",
      subtitle: "Your current balance available for wagers and future upgrades.",
      value: `${stardust} Stardust`,
    },
  ];

  const recentStats = [
    {
      label: "Wins",
      value: String(wins),
    },
    {
      label: "Losses",
      value: String(losses),
    },
    {
      label: "Battles",
      value: String(battles),
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Combat Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Arena</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Enter the Zodiac Clash arena, track live battle readiness, and manage
            your climb through the ladder.
          </p>

          {!isTelegram && !loading ? (
            <p className="mt-3 text-sm text-amber-300/80">
              Preview mode: showing data outside Telegram.
            </p>
          ) : null}

          {error ? (
            <p className="mt-3 text-sm text-rose-300/80">
              Live data error: {error}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <SectionCard className="overflow-hidden xl:col-span-7">
            <div className="relative">
              <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_35%)]" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                    {loading ? "Loading..." : status}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                    Ranked Arena
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {loading ? "Syncing Fighter..." : fighterName}
                </h2>

                <p className="mt-2 text-sm text-white/65">
                  {zodiac} • {archetype}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatPill label="Battles" value={String(battles)} />
                  <StatPill label="Wins" value={String(wins)} />
                  <StatPill label="Streak" value={`${streak}W`} />
                  <StatPill label="Win Rate" value={`${winRate}%`} />
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/75">
                    Arena Pulse
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    {loading ? "Loading arena status..." : arenaPulse}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Combat Snapshot"
            title="Fight Readiness"
            className="xl:col-span-5"
          >
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <Swords className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                      Match Type
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Ranked Arena
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-orange-400/10 p-3 text-orange-300">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                      Streak Pressure
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {loading ? "Loading..." : `${streak} Win Streak`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                      Fighter Power
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {loading ? "Loading..." : String(player?.power ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard eyebrow="Quick Actions" title="Arena Options">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {quickActions.map((item) => (
              <ArenaActionCard key={item.title} item={item} />
            ))}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Battle Snapshot" title="Current Record">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recentStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-4"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {loading ? "..." : item.value}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
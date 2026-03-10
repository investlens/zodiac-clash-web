"use client";

import { AppShell } from "../../components/layout/app-shell";
import { SectionCard } from "../../components/shared/section-card";
import { StatPill } from "../../components/shared/stat-pill";
import { dashboardMock } from "../../lib/mock-data";
import { Flame, Sparkles, Swords, Trophy } from "lucide-react";
import { useCurrentPlayer } from "../../hooks/use-current-player";

export default function DashboardPage() {
  const { player, loading, error, isTelegram } = useCurrentPlayer();

  const activePlayer = player
    ? {
        name: player.name,
        zodiac: player.zodiac,
        archetype: player.archetype,
        rarity: player.rarity,
        level: player.level,
        xp: player.xp,
        xpToNext: player.xpToNext,
        stardust: player.stardust,
        streak: player.streak,
        power: player.power,
      }
    : dashboardMock.player;

  const wins = player?.wins ?? dashboardMock.stats.wins;
  const losses = player?.losses ?? dashboardMock.stats.losses;
  const totalBattles = (player?.battles ?? wins + losses);
  const winRate =
    player?.winRate ??
    (totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0);

  const seasonBadge =
    player?.seasonBadge ??
    `${dashboardMock.player.seasonRole} #${String(
      dashboardMock.player.genesisNumber
    ).padStart(3, "0")}`;

  const xpPercent = Math.min(
    100,
    Math.round((activePlayer.xp / activePlayer.xpToNext) * 100)
  );

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Command Center
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back, {activePlayer.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Track your fighter, enter the arena, and move through the season with
            precision.
          </p>

          {!isTelegram && !loading ? (
            <p className="mt-3 text-sm text-amber-300/80">
              Preview mode: showing mock data outside Telegram.
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
              <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_35%)]" />

              <div className="relative grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-200">
                      {activePlayer.zodiac}
                    </span>
                    <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-fuchsia-200">
                      {activePlayer.rarity}
                    </span>
                  </div>

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                    {activePlayer.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/65">
                    {activePlayer.archetype}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <StatPill label="Level" value={String(activePlayer.level)} />
                    <StatPill label="Power" value={String(activePlayer.power)} />
                    <StatPill label="Stardust" value={String(activePlayer.stardust)} />
                    <StatPill label="Badge" value={seasonBadge} />
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/45">
                      <span>XP Progress</span>
                      <span>
                        {activePlayer.xp}/{activePlayer.xpToNext}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-white/10 bg-[#0b1120]/80 p-4">
                  <div className="flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/20 bg-[radial-gradient(circle,rgba(34,211,238,0.28),rgba(17,24,39,0.1),transparent)] text-center shadow-[0_0_70px_rgba(34,211,238,0.14)]">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                        Zodiac Core
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {activePlayer.zodiac}
                      </p>
                      <p className="mt-1 text-xs text-white/55">
                        {activePlayer.archetype}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Today’s Vibe"
            title={dashboardMock.vibe.title}
            className="xl:col-span-5"
          >
            <p className="text-sm leading-6 text-white/70">
              {dashboardMock.vibe.text}
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                Cosmic Quote
              </p>
              <p className="mt-2 text-sm italic text-white/85">
                “{dashboardMock.vibe.quote}”
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-pink-400/20 bg-pink-400/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-pink-200/70">
                Crush Energy
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {dashboardMock.vibe.crushEnergy}
              </p>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SectionCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Stardust
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {activePlayer.stardust}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-400/10 p-3 text-orange-300">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Win Streak
                </p>
                <p className="mt-1 text-lg font-semibold">{activePlayer.streak}W</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-400/10 p-3 text-violet-300">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Win Rate
                </p>
                <p className="mt-1 text-lg font-semibold">{winRate}%</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                <Swords className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Battles
                </p>
                <p className="mt-1 text-lg font-semibold">{totalBattles}</p>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionCard eyebrow="Live Arena" title="Active Combat Feed">
            <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-4">
              <p className="text-sm text-white/70">
                {dashboardMock.arena.status}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatPill label="Mode" value={dashboardMock.arena.mode} />
                <StatPill label="Opponent" value={dashboardMock.arena.opponent} />
                <StatPill
                  label="Bet"
                  value={`${dashboardMock.arena.bet} Stardust`}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Battle Stats" title="Combat Snapshot">
            <div className="grid grid-cols-2 gap-3">
              <StatPill label="Wins" value={String(wins)} />
              <StatPill label="Losses" value={String(losses)} />
              <StatPill label="Win Rate" value={`${winRate}%`} />
              <StatPill label="Power" value={String(activePlayer.power)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
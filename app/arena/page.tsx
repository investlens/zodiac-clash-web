import { AppShell } from "../../components/layout/app-shell";
import { SectionCard } from "../../components/shared/section-card";
import { StatPill } from "../../components/shared/stat-pill";
import { arenaMock } from "../../lib/mock-data";
import { ArenaActionCard } from "../../components/arena/arena-action-card";
import { RecentBattleItem } from "../../components/arena/recent-battle-item";
import { Flame, Shield, Swords } from "lucide-react";

export default function ArenaPage() {
  const { activeChallenge, quickActions, recentBattles } = arenaMock;

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Combat Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Arena</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Enter the Zodiac Clash arena, manage active challenges, and track your
            recent battle pulse.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <SectionCard className="overflow-hidden xl:col-span-7">
            <div className="relative">
              <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_35%)]" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                    {activeChallenge.status}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                    {activeChallenge.mode}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  Opponent Locked: {activeChallenge.opponent}
                </h2>

                <p className="mt-2 text-sm text-white/65">
                  {activeChallenge.opponentZodiac} • {activeChallenge.opponentArchetype}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatPill label="Mode" value={activeChallenge.mode} />
                  <StatPill
                    label="Wager"
                    value={`${activeChallenge.wager} Stardust`}
                  />
                  <StatPill label="Risk" value={activeChallenge.streakRisk} />
                  <StatPill label="Status" value={activeChallenge.status} />
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/75">
                    Arena Pulse
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    A live challenge is waiting. Entering now puts your streak and
                    Stardust on the line, but keeps your ladder pressure high.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Combat Snapshot" title="Fight Readiness" className="xl:col-span-5">
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
                      {activeChallenge.mode}
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
                      {activeChallenge.streakRisk}
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
                      Opponent Read
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {activeChallenge.opponent}
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

        <SectionCard eyebrow="Recent Activity" title="Battle Pulse">
          <div className="space-y-3">
            {recentBattles.map((battle, index) => (
              <RecentBattleItem
                key={`${battle.opponent}-${index}`}
                battle={battle}
              />
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
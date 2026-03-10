import { AppShell } from "../../components/layout/app-shell";
import { SectionCard } from "../../components/shared/section-card";
import { leaderboardMock } from "../../lib/mock-data";
import { LeaderboardCard } from "../../components/leaderboard/leaderboard-card";

export default function LeaderboardPage() {
  const topPlayer = leaderboardMock[0];
  const totalPlayers = leaderboardMock.length;

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Ranked Arena
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Leaderboard
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Track the strongest fighters rising through the Zodiac Clash ladder.
          </p>
        </div>

        <SectionCard eyebrow="Season Snapshot" title="Current Leaders">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.05] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-yellow-200/70">
                Rank #1
              </p>
              <p className="mt-2 text-xl font-semibold">{topPlayer.name}</p>
              <p className="mt-1 text-sm text-white/60">
                {topPlayer.zodiac} • {topPlayer.archetype}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                Total Ranked Fighters
              </p>
              <p className="mt-2 text-xl font-semibold">{totalPlayers}</p>
              <p className="mt-1 text-sm text-white/60">Visible this season</p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">
                Competitive Pulse
              </p>
              <p className="mt-2 text-xl font-semibold">High Activity</p>
              <p className="mt-1 text-sm text-white/60">
                Arena ladder is moving fast
              </p>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          {leaderboardMock.map((player) => (
            <LeaderboardCard key={player.rank} player={player} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
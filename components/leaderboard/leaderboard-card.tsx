type LeaderboardPlayer = {
  rank: number;
  name: string;
  zodiac: string;
  archetype: string;
  rarity: string;
  level: number;
  wins: number;
  battles: number;
  streak: number;
  seasonRole: string;
  genesisNumber: number | null;
};

function rarityClasses(rarity: string) {
  switch (rarity) {
    case "Mythic":
      return "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200";
    case "Epic":
      return "border-violet-400/30 bg-violet-400/10 text-violet-200";
    case "Rare":
      return "border-cyan-400/30 bg-cyan-400/10 text-cyan-200";
    default:
      return "border-white/15 bg-white/5 text-white/75";
  }
}

function rankClasses(rank: number) {
  if (rank === 1) {
    return "border-yellow-400/25 bg-yellow-400/[0.06]";
  }
  if (rank === 2) {
    return "border-slate-300/20 bg-slate-300/[0.05]";
  }
  if (rank === 3) {
    return "border-orange-400/20 bg-orange-400/[0.05]";
  }
  return "border-white/10 bg-white/[0.04]";
}

function getBadge(player: LeaderboardPlayer) {
  if (player.seasonRole === "Genesis" && player.genesisNumber) {
    return `Genesis #${String(player.genesisNumber).padStart(3, "0")}`;
  }
  return player.seasonRole;
}

export function LeaderboardCard({ player }: { player: LeaderboardPlayer }) {
  const winRate =
    player.battles > 0 ? Math.round((player.wins / player.battles) * 100) : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl ${rankClasses(
        player.rank
      )}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0b1120] text-lg font-semibold text-white">
            #{player.rank}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold tracking-tight text-white">
                {player.name}
              </h3>

              <span
                className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${rarityClasses(
                  player.rarity
                )}`}
              >
                {player.rarity}
              </span>
            </div>

            <p className="mt-1 text-sm text-white/65">
              {player.zodiac} • {player.archetype} • Level {player.level}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                {player.zodiac}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                {getBadge(player)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:w-[420px]">
          <MiniStat label="Wins" value={String(player.wins)} />
          <MiniStat label="Battles" value={String(player.battles)} />
          <MiniStat label="Win Rate" value={`${winRate}%`} />
          <MiniStat label="Streak" value={`${player.streak}W`} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1120] px-3 py-3">
      <p className="text-[9px] uppercase tracking-[0.22em] text-white/40">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
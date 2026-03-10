type RecentBattleItemProps = {
  battle: {
    opponent: string;
    result: string;
    wager: number;
    mode: string;
  };
};

function resultClasses(result: string) {
  if (result === "Win") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }

  return "border-rose-400/30 bg-rose-400/10 text-rose-200";
}

export function RecentBattleItem({ battle }: RecentBattleItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-4">
      <div>
        <p className="text-sm font-medium text-white">{battle.opponent}</p>
        <p className="mt-1 text-xs text-white/55">
          {battle.mode} • {battle.wager} Stardust
        </p>
      </div>

      <span
        className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${resultClasses(
          battle.result
        )}`}
      >
        {battle.result}
      </span>
    </div>
  );
}
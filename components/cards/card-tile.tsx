type CardTileProps = {
  card: {
    id: string;
    name: string;
    zodiac: string;
    archetype: string;
    rarity: string;
    level: number;
    power: number;
    owned: boolean;
  };
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

export function CardTile({ card }: CardTileProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[24px] border p-4 transition ${
        card.owned
          ? "border-white/10 bg-white/[0.04] hover:border-cyan-400/20 hover:bg-white/[0.06]"
          : "border-white/8 bg-white/[0.02] opacity-80"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold tracking-tight">
              {card.owned ? card.name : "Unknown Fighter"}
            </p>
            <p className="mt-1 text-xs text-white/55">
              {card.owned ? card.archetype : "Locked"}
            </p>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${rarityClasses(
              card.rarity
            )}`}
          >
            {card.rarity}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/15 bg-[radial-gradient(circle,rgba(34,211,238,0.22),rgba(17,24,39,0.1),transparent)] text-center">
            <div>
              <p className="text-[8px] uppercase tracking-[0.28em] text-white/45">
                Zodiac
              </p>
              <p className="mt-1 text-sm font-semibold">
                {card.owned ? card.zodiac : "???"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniInfo label="Level" value={card.owned ? String(card.level) : "--"} />
          <MiniInfo label="Power" value={card.owned ? String(card.power) : "--"} />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <span>{card.owned ? card.zodiac : "Locked"}</span>
          <span>{card.owned ? "Owned" : "Coming Later"}</span>
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1120] px-3 py-2">
      <p className="text-[9px] uppercase tracking-[0.22em] text-white/40">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
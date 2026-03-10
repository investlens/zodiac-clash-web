type FeaturedCardProps = {
  card: {
    id: string;
    name: string;
    zodiac: string;
    archetype: string;
    rarity: string;
    level: number;
    power: number;
    status: string;
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

export function FeaturedCard({ card }: FeaturedCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_35%)]" />

      <div className="relative grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Featured Fighter
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            {card.name}
          </h2>

          <p className="mt-2 text-sm text-white/65">{card.archetype}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-200">
              {card.zodiac}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${rarityClasses(
                card.rarity
              )}`}
            >
              {card.rarity}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
              {card.status}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoBox label="Level" value={String(card.level)} />
            <InfoBox label="Power" value={String(card.power)} />
            <InfoBox label="Class" value={card.archetype} />
          </div>
        </div>

        <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-white/10 bg-[#0b1120]/80 p-4">
          <div className="relative flex h-64 w-48 flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-4 shadow-[0_0_50px_rgba(34,211,238,0.08)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_35%)]" />

            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                Origin Series
              </p>
              <p className="mt-2 text-lg font-semibold">{card.name}</p>
              <p className="mt-1 text-xs text-white/55">{card.archetype}</p>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/20 bg-[radial-gradient(circle,rgba(34,211,238,0.3),rgba(17,24,39,0.12),transparent)] text-center">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-white/45">
                    Zodiac
                  </p>
                  <p className="mt-1 text-lg font-semibold">{card.zodiac}</p>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between text-xs text-white/70">
              <span>{card.rarity}</span>
              <span>Lv. {card.level}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
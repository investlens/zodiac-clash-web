"use client";

import { AppShell } from "../../components/layout/app-shell";
import { SectionCard } from "../../components/shared/section-card";
import { FeaturedCard } from "../../components/cards/featured-card";
import { StatPill } from "../../components/shared/stat-pill";
import { useCurrentPlayer } from "../../hooks/use-current-player";

export default function CardsPage() {
  const { player, loading, error, isTelegram } = useCurrentPlayer();

  const featured = {
  id: "origin-001",
  name: player?.name ?? "Origin Fighter",
  zodiac: player?.zodiac ?? "Unknown",
  archetype: player?.archetype ?? "Unassigned",
  rarity: player?.rarity ?? "Origin",
  level: player?.level ?? 1,
  power: player?.power ?? 0,
  status: "Origin Card",
  portraitUrl: player?.card_image_url ?? null,
};

  const traitPoints = player?.traitPoints ?? {};
  const traits = Object.entries(traitPoints)
    .map(([name, points]) => ({
      name,
      points: Number(points) || 0,
    }))
    .filter((trait) => trait.points > 0);

  const seasonBadge = player?.seasonBadge ?? "Unranked";

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Card Collection
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cards</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Your active fighter identity, origin card, and trait build in one
            premium vault.
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

        <FeaturedCard card={featured} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionCard eyebrow="Card Summary" title="Origin Identity">
            <div className="grid grid-cols-2 gap-3">
              <StatPill label="Name" value={loading ? "Loading..." : featured.name} />
              <StatPill label="Zodiac" value={loading ? "Loading..." : featured.zodiac} />
              <StatPill
                label="Archetype"
                value={loading ? "Loading..." : featured.archetype}
              />
              <StatPill label="Level" value={loading ? "..." : String(featured.level)} />
              <StatPill label="Power" value={loading ? "..." : String(featured.power)} />
              <StatPill
                label="Season Badge"
                value={loading ? "Loading..." : seasonBadge}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/75">
                Collection Status
              </p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Your Origin Card is the foundation of your Zodiac Clash identity.
                Future minted cards, skins, and upgrades can expand from this core
                fighter.
              </p>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Traits" title="Origin Build">
            {loading ? (
              <p className="text-sm text-white/70">Loading traits...</p>
            ) : traits.length === 0 ? (
              <p className="text-sm text-white/70">
                No trait point data available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {traits.map((trait) => {
                  const percent = Math.min(
                    100,
                    Math.round((trait.points / 25) * 100)
                  );

                  return (
                    <div
                      key={trait.name}
                      className="rounded-2xl border border-white/10 bg-[#0b1120] p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium capitalize text-white/90">
                          {trait.name}
                        </p>
                        <p className="text-sm text-white/65">{trait.points}</p>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
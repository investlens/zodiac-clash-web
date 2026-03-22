"use client";

import { AppShell } from "../../components/layout/app-shell";
import { SectionCard } from "../../components/shared/section-card";
import { StatPill } from "../../components/shared/stat-pill";
import { profileMock } from "../../lib/mock-data";
import { Crown, Gem, Sparkles, Star } from "lucide-react";
import { useCurrentPlayer } from "../../hooks/use-current-player";
import { ShareCardButton } from "../../components/shared/share-card-button";

type TraitItem = {
  name: string;
  points: number;
};

function getTraitItems(
  liveTraitPoints?: Record<string, number>
): TraitItem[] | null {
  if (!liveTraitPoints || typeof liveTraitPoints !== "object") return null;

  const items = Object.entries(liveTraitPoints)
    .map(([name, points]) => ({
      name,
      points: Number(points) || 0,
    }))
    .filter((item) => item.points > 0);

  return items.length ? items : null;
}

function getPower(traits: TraitItem[]) {
  return traits.reduce((sum, trait) => sum + trait.points, 0);
}

export default function ProfilePage() {
  const { player: livePlayer, loading, error, isTelegram } = useCurrentPlayer();

  const fallbackPlayer = profileMock.player;
  const liveTraits = getTraitItems(livePlayer?.traitPoints);
  const traits = liveTraits ?? profileMock.traits;

  const player = livePlayer
    ? {
        name: livePlayer.name,
        zodiac: livePlayer.zodiac,
        archetype: livePlayer.archetype,
        rarity: livePlayer.rarity,
        level: livePlayer.level,
        xp: livePlayer.xp,
        xpToNext: livePlayer.xpToNext,
        stardust: livePlayer.stardust,
        seasonRole: livePlayer.seasonBadge.startsWith("Genesis")
          ? "Genesis"
          : livePlayer.seasonBadge,
        genesisNumber: livePlayer.seasonBadge.startsWith("Genesis #")
          ? Number(livePlayer.seasonBadge.replace("Genesis #", ""))
          : null,
      }
    : fallbackPlayer;

  const power = livePlayer?.power ?? getPower(traits);
  const xpPercent =
    player.xpToNext > 0 ? Math.round((player.xp / player.xpToNext) * 100) : 0;

  const seasonBadge = livePlayer?.seasonBadge
    ? livePlayer.seasonBadge
    : player.seasonRole === "Genesis" && player.genesisNumber
    ? `Genesis #${String(player.genesisNumber).padStart(3, "0")}`
    : player.seasonRole;

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Player Identity
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Profile
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Your origin fighter, trait build, and core progression at a glance.
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
          <div className="mt-4">
          <ShareCardButton telegramId={livePlayer?.telegramId} />
        </div>

        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <SectionCard className="overflow-hidden xl:col-span-7">
            <div className="relative">
              <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_35%)]" />

              <div className="relative grid gap-5 md:grid-cols-[1fr_0.9fr]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-200">
                      {player.zodiac}
                    </span>
                    <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-fuchsia-200">
                      {player.rarity}
                    </span>
                  </div>

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                    {player.name}
                  </h2>

                  <p className="mt-2 text-sm text-white/65">{player.archetype}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <StatPill label="Level" value={String(player.level)} />
                    <StatPill label="Power" value={String(power)} />
                    <StatPill label="Stardust" value={String(player.stardust)} />
                    <StatPill label="Badge" value={seasonBadge} />
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/45">
                      <span>XP Progress</span>
                      <span>
                        {player.xp}/{player.xpToNext}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
                        style={{ width: `${Math.min(100, xpPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-white/10 bg-[#0b1120]/80 p-4">
                {livePlayer?.card_image_url ? (
                  <img
                    src={livePlayer.card_image_url}
                    alt={player.name}
                    className="h-64 w-48 rounded-[24px] object-cover border border-white/10 shadow-[0_0_40px_rgba(34,211,238,0.12)]"
                  />
                ) : (
                  <div className="relative flex h-52 w-40 flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-4 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_35%)]" />

                    <div className="relative">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                        Origin Card
                      </p>
                      <p className="mt-2 text-lg font-semibold">{player.name}</p>
                      <p className="mt-1 text-xs text-white/55">{player.archetype}</p>
                    </div>

                    <div className="relative flex flex-1 items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/20 bg-[radial-gradient(circle,rgba(34,211,238,0.3),rgba(17,24,39,0.12),transparent)] text-center">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.28em] text-white/45">
                            Zodiac
                          </p>
                          <p className="mt-1 text-lg font-semibold">{player.zodiac}</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between text-xs text-white/70">
                      <span>{player.rarity}</span>
                      <span>Lv. {player.level}</span>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Identity Summary"
            title="Core Build"
            className="xl:col-span-5"
          >
            <div className="space-y-3">
              <SummaryRow
                icon={<Star className="h-4 w-4" />}
                label="Zodiac"
                value={player.zodiac}
              />
              <SummaryRow
                icon={<Sparkles className="h-4 w-4" />}
                label="Archetype"
                value={player.archetype}
              />
              <SummaryRow
                icon={<Gem className="h-4 w-4" />}
                label="Rarity"
                value={player.rarity}
              />
              <SummaryRow
                icon={<Crown className="h-4 w-4" />}
                label="Season Badge"
                value={seasonBadge}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                Profile Note
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Your origin fighter reflects your zodiac identity and current trait
                build. Future upgrades, cosmetics, and evolution systems can expand
                from this core profile.
              </p>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionCard eyebrow="Traits" title="Trait Points">
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
          </SectionCard>

          <SectionCard eyebrow="Progress" title="Profile Snapshot">
            <div className="grid grid-cols-2 gap-3">
              <StatPill label="Level" value={String(player.level)} />
              <StatPill label="XP" value={`${player.xp}/${player.xpToNext}`} />
              <StatPill label="Stardust" value={String(player.stardust)} />
              <StatPill label="Power" value={String(power)} />
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/75">
                Build Focus
              </p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                This fighter build leans into sharp reads, pressure, and controlled
                aggression. The trait layout should feel powerful without overwhelming
                the player with too much information.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-cyan-300">{icon}</div>
        <p className="text-sm text-white/65">{label}</p>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import {
  CombatUpgradeKey,
  DEFAULT_COMBAT_UPGRADES,
  UPGRADE_KEYS,
  getUpgradeCost,
  getUpgradeDescription,
  normalizeCombatUpgrades,
  getCappedUpgradeBonus,
} from "@/lib/combat-upgrades";

type UserType = {
  telegram_id: string;
  first_name?: string | null;
  username?: string | null;
  zodiac?: string | null;
  archetype?: string | null;
  card_name?: string | null;
  stardust?: number | null;
  traits?: string[] | null;
  trait_points?: Record<string, number> | null;
  combat_upgrades?: any;
};

function totalPower(traitPoints: Record<string, number> | null | undefined) {
  if (!traitPoints) return 0;
  return Object.values(traitPoints).reduce((sum, v) => sum + Number(v || 0), 0);
}

const ICONS: Record<CombatUpgradeKey, string> = {
  attack: "⚔️",
  defense: "🛡️",
  crit: "💥",
  lifesteal: "🩸",
  speed: "⚡",
  recovery: "✨",
};

export default function UpgradesClient({ user }: { user: UserType }) {
  const [stardust, setStardust] = useState(user.stardust ?? 0);
  const [combatUpgrades, setCombatUpgrades] = useState(
    normalizeCombatUpgrades(user.combat_upgrades || DEFAULT_COMBAT_UPGRADES)
  );
  const [loadingStat, setLoadingStat] = useState<CombatUpgradeKey | null>(null);
  const [message, setMessage] = useState("");

  const basePower = useMemo(() => totalPower(user.trait_points), [user.trait_points]);
  const bonusPower = useMemo(
    () => getCappedUpgradeBonus(basePower, combatUpgrades),
    [basePower, combatUpgrades]
  );
  const effectivePower = basePower + bonusPower;

  async function handleUpgrade(stat: CombatUpgradeKey) {
    try {
      setLoadingStat(stat);
      setMessage("");

      const res = await fetch("/api/upgrades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stat,
          key: new URLSearchParams(window.location.search).get("key"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Upgrade failed");
        return;
      }

      setCombatUpgrades(data.combatUpgrades);
      setStardust(data.stardustLeft);
      setMessage(`${labelFor(stat)} upgraded to Lv ${data.newLevel}`);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoadingStat(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-2xl font-bold">
            {user.card_name || user.first_name || "Unnamed Fighter"}
          </div>

          <div className="mt-1 text-sm text-white/65">
            {user.zodiac || "Unknown Zodiac"} • {user.archetype || "Unknown Archetype"}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Stardust" value={String(stardust)} />
            <Stat label="Base Power" value={String(basePower)} />
            <Stat label="Boost" value={`+${bonusPower}`} />
            <Stat label="Battle Power" value={String(effectivePower)} />
          </div>

          {message ? (
            <div className="mt-4 rounded-2xl bg-white/5 px-4 py-3 text-sm text-amber-300">
              {message}
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-3 text-lg font-semibold">Upgrade Traits</div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {UPGRADE_KEYS.map((key) => {
              const level = combatUpgrades[key];
              const cost = getUpgradeCost(level);
              const maxed = level >= 5;
              const canAfford = stardust >= cost;

              return (
                <div
                  key={key}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      {ICONS[key]} {labelFor(key)}
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1 text-sm">
                      Lv {level}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-white/65">
                    {getUpgradeDescription(key)}
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${(level / 5) * 100}%` }}
                    />
                  </div>

                  <div className="mt-4 text-sm text-white/75">
                    {maxed ? "Max level reached" : `Cost: ${cost} Stardust`}
                  </div>

                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={loadingStat === key || maxed || !canAfford}
                    className="mt-4 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-40"
                  >
                    {maxed
                      ? "Maxed"
                      : loadingStat === key
                      ? "Upgrading..."
                      : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold">Core Traits</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(user.traits || []).map((trait) => (
              <span
                key={trait}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function labelFor(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
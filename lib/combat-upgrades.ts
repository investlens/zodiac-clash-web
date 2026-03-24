export type CombatUpgradeKey =
  | "attack"
  | "defense"
  | "crit"
  | "lifesteal"
  | "speed"
  | "recovery";

export type CombatUpgrades = {
  attack: number;
  defense: number;
  crit: number;
  lifesteal: number;
  speed: number;
  recovery: number;
};

export const UPGRADE_KEYS: CombatUpgradeKey[] = [
  "attack",
  "defense",
  "crit",
  "lifesteal",
  "speed",
  "recovery",
];

export const MAX_UPGRADE_LEVEL = 5;

export const DEFAULT_COMBAT_UPGRADES: CombatUpgrades = {
  attack: 0,
  defense: 0,
  crit: 0,
  lifesteal: 0,
  speed: 0,
  recovery: 0,
};

export function normalizeCombatUpgrades(input: any): CombatUpgrades {
  return {
    attack: clamp(input?.attack),
    defense: clamp(input?.defense),
    crit: clamp(input?.crit),
    lifesteal: clamp(input?.lifesteal),
    speed: clamp(input?.speed),
    recovery: clamp(input?.recovery),
  };
}

function clamp(value: any): number {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(MAX_UPGRADE_LEVEL, Math.floor(n)));
}

export function getUpgradeCost(currentLevel: number): number {
  const costs = [50, 100, 180, 300, 500];
  return costs[currentLevel] ?? 999999;
}

export function getUpgradeDescription(key: CombatUpgradeKey): string {
  switch (key) {
    case "attack":
      return "Hit harder in battle";
    case "defense":
      return "Reduce incoming pressure";
    case "crit":
      return "Increase burst potential";
    case "lifesteal":
      return "Recover while attacking";
    case "speed":
      return "Improve battle tempo";
    case "recovery":
      return "Improve sustain and comeback";
  }
}

export function getWeightedRawUpgradeBonus(upgrades: CombatUpgrades): number {
  return (
    upgrades.attack * 1.2 +
    upgrades.defense * 1.2 +
    upgrades.crit * 1.0 +
    upgrades.lifesteal * 0.9 +
    upgrades.speed * 0.85 +
    upgrades.recovery * 0.85
  );
}

export function getCappedUpgradeBonus(
  basePower: number,
  upgrades: CombatUpgrades
): number {
  const raw = Math.floor(getWeightedRawUpgradeBonus(upgrades));
  const cap = Math.floor(basePower * 0.3);
  return Math.min(raw, cap);
}
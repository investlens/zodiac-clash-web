import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  type CombatUpgradeKey,
  DEFAULT_COMBAT_UPGRADES,
  MAX_UPGRADE_LEVEL,
  UPGRADE_KEYS,
  getUpgradeCost,
  normalizeCombatUpgrades,
} from "@/lib/combat-upgrades";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const stat = String(body.stat || "") as CombatUpgradeKey;
    const betaKey = String(body.key || "");

    if (!process.env.UPGRADES_BETA_KEY || betaKey !== process.env.UPGRADES_BETA_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!UPGRADE_KEYS.includes(stat)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const telegramId = process.env.TEST_TELEGRAM_ID;
    if (!telegramId) {
      return NextResponse.json({ error: "Missing TEST_TELEGRAM_ID" }, { status: 500 });
    }

    const supabase = createAdminClient();

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("telegram_id, stardust, combat_upgrades")
      .eq("telegram_id", telegramId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const upgrades = normalizeCombatUpgrades(
      user.combat_upgrades || DEFAULT_COMBAT_UPGRADES
    );

    const currentLevel = upgrades[stat];
    if (currentLevel >= MAX_UPGRADE_LEVEL) {
      return NextResponse.json(
        { error: "This upgrade is already maxed" },
        { status: 400 }
      );
    }

    const cost = getUpgradeCost(currentLevel);
    if ((user.stardust ?? 0) < cost) {
      return NextResponse.json(
        { error: "Not enough Stardust" },
        { status: 400 }
      );
    }

    const nextUpgrades = {
      ...upgrades,
      [stat]: currentLevel + 1,
    };

    const { error: updateError } = await supabase
      .from("users")
      .update({
        stardust: user.stardust - cost,
        combat_upgrades: nextUpgrades,
      })
      .eq("telegram_id", telegramId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to upgrade" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      stat,
      oldLevel: currentLevel,
      newLevel: currentLevel + 1,
      cost,
      stardustLeft: user.stardust - cost,
      combatUpgrades: nextUpgrades,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { verifyTelegramInitData } from "../../../lib/telegram/verify";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const [scheme, rawInitData] = authHeader.split(" ");

    if (scheme !== "tma" || !rawInitData) {
      return NextResponse.json(
        { error: "Missing Telegram auth data" },
        { status: 401 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN!;
    const verified = verifyTelegramInitData(rawInitData, botToken);

    if (!verified?.user?.id) {
      return NextResponse.json(
        { error: "Invalid Telegram auth data" },
        { status: 401 }
      );
    }

    const telegramId = String(verified.user.id);
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("users")
      .select(`
        telegram_id,
        zodiac,
        archetype,
        traits,
        trait_points,
        card_name,
        stardust,
        xp,
        level,
        arena_battles_played,
        arena_battles_won,
        arena_win_streak,
        season_role,
        genesis_number
      `)
      .eq("telegram_id", telegramId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Player not found", telegram_id: telegramId },
        { status: 404 }
      );
    }

    const traitPoints =
      data.trait_points && typeof data.trait_points === "object"
        ? Object.values(data.trait_points).reduce(
            (sum: number, value: unknown) => sum + (Number(value) || 0),
            0
          )
        : 0;

    const wins = Number(data.arena_battles_won || 0);
    const battles = Number(data.arena_battles_played || 0);
    const losses = Math.max(0, battles - wins);
    const winRate = battles > 0 ? Math.round((wins / battles) * 100) : 0;

    const seasonBadge =
      data.season_role === "genesis" && data.genesis_number
        ? `Genesis #${String(data.genesis_number).padStart(3, "0")}`
        : data.season_role
        ? String(data.season_role)
        : "Unranked";

    return NextResponse.json({
      player: {
        telegramId: data.telegram_id,
        name: data.card_name || "Unknown Fighter",
        zodiac: data.zodiac || "Unknown",
        archetype: data.archetype || "Unassigned",
        rarity: "Origin",
        level: Number(data.level || 1),
        xp: Number(data.xp || 0),
        xpToNext: 1000,
        stardust: Number(data.stardust || 0),
        streak: Number(data.arena_win_streak || 0),
        power: traitPoints,
        wins,
        losses,
        battles,
        winRate,
        seasonBadge,
        traits: data.traits || {},
        traitPoints: data.trait_points || {},
      },
    });
  } catch (error) {
    console.error("GET /api/me failed", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
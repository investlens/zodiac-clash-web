// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { verifyTelegramInitData } from "../../../lib/telegram/verify";

function mapPlayerResponse(data: any) {
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

  const luckActive =
    Boolean(data.luck_until) &&
    new Date(String(data.luck_until)).getTime() > Date.now();

  return {
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
      shieldUses: Number(data.shield_uses || 0),
      luckActive,
      dailyCombo: Number(data.daily_streak || 1),
      card_image_url: data.card_image_url || null,
      card_image_status: data.card_image_status || null,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();

    if (process.env.NODE_ENV === "development") {
      const authHeader = request.headers.get("authorization") || "";

      if (!authHeader) {
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
            genesis_number,
            shield_uses,
            luck_until,
            daily_streak,
            card_image_url,
            card_image_status
          `)
          .limit(1)
          .single();

        if (error || !data) {
          return NextResponse.json(
            { error: "Dev test: player not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(mapPlayerResponse(data));
      }
    }

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
        genesis_number,
        shield_uses,
        luck_until,
        daily_streak,
        card_image_url,
        card_image_status
      `)
      .eq("telegram_id", telegramId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Player not found", telegram_id: telegramId },
        { status: 404 }
      );
    }

    return NextResponse.json(mapPlayerResponse(data));
  } catch (error) {
    console.error("GET /api/me failed", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
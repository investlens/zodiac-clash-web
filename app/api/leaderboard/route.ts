// app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";

function mapSeasonBadge(seasonRole: string | null, genesisNumber: number | null) {
  if (seasonRole === "genesis" && genesisNumber) {
    return `Genesis #${String(genesisNumber).padStart(3, "0")}`;
  }

  if (seasonRole) {
    return seasonRole.charAt(0).toUpperCase() + seasonRole.slice(1);
  }

  return "Unranked";
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("users")
      .select(`
        telegram_id,
        card_name,
        zodiac,
        archetype,
        level,
        arena_battles_played,
        arena_battles_won,
        arena_win_streak,
        season_role,
        genesis_number
      `)
      .order("arena_battles_won", { ascending: false })
      .order("arena_win_streak", { ascending: false })
      .order("level", { ascending: false })
      .limit(25);

    if (error) {
      return NextResponse.json(
        { error: "Failed to load leaderboard" },
        { status: 500 }
      );
    }

    const leaderboard = (data || []).map((player, index) => {
      const wins = Number(player.arena_battles_won || 0);
      const battles = Number(player.arena_battles_played || 0);
      const streak = Number(player.arena_win_streak || 0);
      const winRate = battles > 0 ? Math.round((wins / battles) * 100) : 0;

      return {
        rank: index + 1,
        telegramId: String(player.telegram_id),
        name: player.card_name || "Unknown Fighter",
        zodiac: player.zodiac || "Unknown",
        archetype: player.archetype || "Unassigned",
        rarity: "Origin",
        level: Number(player.level || 1),
        wins,
        battles,
        streak,
        winRate,
        seasonBadge: mapSeasonBadge(player.season_role, player.genesis_number),
      };
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("GET /api/leaderboard failed", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
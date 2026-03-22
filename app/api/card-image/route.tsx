// app/api/card-image/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { buildCardData } from "../../../lib/share-card/build-card-data";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get("telegram_id");

    if (!telegramId) {
      return new Response("Missing telegram_id", { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("users")
      .select(`
        telegram_id,
        card_name,
        zodiac,
        archetype,
        trait_points,
        level,
        arena_battles_played,
        arena_battles_won,
        season_role,
        genesis_number,
        card_image_url
      `)
      .eq("telegram_id", telegramId)
      .single();

    if (error || !data) {
      return new Response("Player not found", { status: 404 });
    }

    const power =
      data.trait_points && typeof data.trait_points === "object"
        ? Object.values(data.trait_points).reduce(
            (sum: number, value: unknown) => sum + (Number(value) || 0),
            0
          )
        : 0;

    const wins = Number(data.arena_battles_won || 0);
    const battles = Number(data.arena_battles_played || 0);
    const winRate = battles > 0 ? Math.round((wins / battles) * 100) : 0;

    const seasonBadge =
      data.season_role === "genesis" && data.genesis_number
        ? `Genesis #${String(data.genesis_number).padStart(3, "0")}`
        : data.season_role
        ? String(data.season_role)
        : "Unranked";

    const card = buildCardData({
      name: data.card_name || "Unknown Fighter",
      zodiac: data.zodiac || "Unknown",
      archetype: data.archetype || "Unassigned",
      level: Number(data.level || 1),
      power,
      winRate,
      seasonBadge,
      portraitUrl: data.card_image_url || null,
    });

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: `linear-gradient(135deg, ${card.theme.primary}, ${card.theme.secondary})`,
            color: "white",
            fontFamily: "sans-serif",
            padding: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 32,
              background: "rgba(255,255,255,0.06)",
              padding: 36,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: 60,
                top: 80,
                width: 320,
                height: 320,
                borderRadius: 999,
                background: `radial-gradient(circle, ${card.theme.accent}55, transparent 70%)`,
              }}
            />

            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                gap: 28,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontSize: 20,
                      letterSpacing: 6,
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                      display: "flex",
                    }}
                  >
                    Zodiac Clash
                  </div>

                  <div
                    style={{
                      marginTop: 24,
                      fontSize: 58,
                      fontWeight: 800,
                      display: "flex",
                    }}
                  >
                    {card.name}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 26,
                      color: card.theme.accent,
                      display: "flex",
                    }}
                  >
                    {card.subtitle}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 22,
                      color: "rgba(255,255,255,0.84)",
                      display: "flex",
                    }}
                  >
                    {card.archetypeLine}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    alignItems: "stretch",
                  }}
                >
                  {[
                    { label: "Level", value: String(card.level) },
                    { label: "Power", value: String(card.power) },
                    { label: "Win Rate", value: `${card.winRate}%` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 150,
                        padding: "18px 20px",
                        borderRadius: 20,
                        background: "rgba(0,0,0,0.22)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          color: "rgba(255,255,255,0.6)",
                          display: "flex",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 28,
                          fontWeight: 700,
                          display: "flex",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 22,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      padding: "12px 18px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.09)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontSize: 18,
                    }}
                  >
                    {card.seasonBadge}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      fontSize: 18,
                      color: "rgba(255,255,255,0.74)",
                    }}
                  >
                    Join the Arena • t.me/ZodiacClash
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: 360,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 320,
                    height: 320,
                    borderRadius: 999,
                    background: `radial-gradient(circle, ${card.theme.accent}66, transparent 72%)`,
                  }}
                />

                {card.portraitUrl ? (
                  <img
                    src={card.portraitUrl}
                    alt={card.name}
                    style={{
                      width: 320,
                      height: 500,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 280,
                      height: 280,
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 92,
                      color: "rgba(255,255,255,0.85)",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {card.subtitle.split(" ")[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("GET /api/card-image failed", error);
    return new Response("Failed to generate card", { status: 500 });
  }
}
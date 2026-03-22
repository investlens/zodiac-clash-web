// app/api/battle-image/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { buildCardData } from "../../../lib/share-card/build-card-data";

export const runtime = "edge";

function calcPower(traitPoints: unknown): number {
  if (!traitPoints || typeof traitPoints !== "object" || Array.isArray(traitPoints)) {
    return 0;
  }

  return Object.values(traitPoints).reduce(
    (sum: number, value: unknown) => sum + (Number(value) || 0),
    0
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const creatorTid = searchParams.get("creator_tid");
    const joinerTid = searchParams.get("joiner_tid");
    const bet = Number(searchParams.get("bet") || 0);

    if (!creatorTid || !joinerTid) {
      return new Response("Missing creator_tid or joiner_tid", { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: users, error } = await supabase
      .from("users")
      .select(`
        telegram_id,
        card_name,
        zodiac,
        archetype,
        trait_points,
        level,
        card_image_url
      `)
      .in("telegram_id", [creatorTid, joinerTid]);

    if (error || !users || users.length < 2) {
      return new Response("Players not found", { status: 404 });
    }

    const creatorRaw = users.find((u) => String(u.telegram_id) === String(creatorTid));
    const joinerRaw = users.find((u) => String(u.telegram_id) === String(joinerTid));

    if (!creatorRaw || !joinerRaw) {
      return new Response("Players not found", { status: 404 });
    }

    const creatorPower = calcPower(creatorRaw.trait_points);
    const joinerPower = calcPower(joinerRaw.trait_points);

    const creator = buildCardData({
      name: creatorRaw.card_name || "Unknown Fighter",
      zodiac: creatorRaw.zodiac || "Unknown",
      archetype: creatorRaw.archetype || "Unassigned",
      level: Number(creatorRaw.level || 1),
      power: creatorPower,
      winRate: 0,
      seasonBadge: "Arena Fighter",
      portraitUrl: creatorRaw.card_image_url || null,
    });

    const joiner = buildCardData({
      name: joinerRaw.card_name || "Unknown Fighter",
      zodiac: joinerRaw.zodiac || "Unknown",
      archetype: joinerRaw.archetype || "Unassigned",
      level: Number(joinerRaw.level || 1),
      power: joinerPower,
      winRate: 0,
      seasonBadge: "Arena Fighter",
      portraitUrl: joinerRaw.card_image_url || null,
    });

    return new ImageResponse(
  (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background:
          "linear-gradient(135deg, #0A1022 0%, #171E3F 42%, #22163A 100%)",
        color: "white",
        fontFamily: "sans-serif",
        padding: 28,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          borderRadius: 34,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 48%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 24,
            left: 32,
            display: "flex",
            fontSize: 18,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
          }}
        >
          Zodiac Clash • Arena Duel
        </div>

        <div
          style={{
            position: "absolute",
            top: 22,
            right: 28,
            display: "flex",
            padding: "10px 16px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            fontSize: 18,
            fontWeight: 700,
            color: "white",
          }}
        >
          {bet > 0 ? `Bet: ${bet} 💎` : "FREE DUEL"}
        </div>

        {/* LEFT SIDE */}
        <div
          style={{
            width: "40%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "70px 28px 34px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 340,
              height: 340,
              borderRadius: 999,
              background: `radial-gradient(circle, ${creator.theme.accent}44, transparent 72%)`,
            }}
          />

          <div
            style={{
              width: 280,
              height: 300,
              borderRadius: 26,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
            }}
          >
            {creator.portraitUrl ? (
              <img
                src={creator.portraitUrl}
                alt={creator.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 72,
                  color: "rgba(255,255,255,0.88)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {creator.subtitle.split(" ")[0]}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 20,
              width: 320,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 800,
                textAlign: "center",
                lineHeight: 1.15,
                justifyContent: "center",
              }}
            >
              {creator.name}
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                fontSize: 18,
                color: creator.theme.accent,
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              {creator.subtitle}
            </div>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.24)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 18,
                }}
              >
                Level {creator.level}
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.24)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 18,
                }}
              >
                Power {creator.power}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div
          style={{
            width: "20%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.28), rgba(255,255,255,0.07))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 0 70px rgba(255,255,255,0.12)",
              fontSize: 54,
              fontWeight: 900,
            }}
          >
            VS
          </div>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: 17,
              color: "rgba(255,255,255,0.86)",
            }}
          >
            {bet > 0 ? `${bet} 💎 Entry` : "Free Fight"}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            width: "40%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "70px 28px 34px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 340,
              height: 340,
              borderRadius: 999,
              background: `radial-gradient(circle, ${joiner.theme.accent}44, transparent 72%)`,
            }}
          />

          <div
            style={{
              width: 280,
              height: 300,
              borderRadius: 26,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
            }}
          >
            {joiner.portraitUrl ? (
              <img
                src={joiner.portraitUrl}
                alt={joiner.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 72,
                  color: "rgba(255,255,255,0.88)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {joiner.subtitle.split(" ")[0]}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 20,
              width: 320,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 800,
                textAlign: "center",
                lineHeight: 1.15,
                justifyContent: "center",
              }}
            >
              {joiner.name}
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                fontSize: 18,
                color: joiner.theme.accent,
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              {joiner.subtitle}
            </div>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.24)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 18,
                }}
              >
                Level {joiner.level}
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.24)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 18,
                }}
              >
                Power {joiner.power}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: 18,
            color: "rgba(255,255,255,0.72)",
            letterSpacing: 0.4,
          }}
        >
          Battle commencing...
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
    console.error("GET /api/battle-image failed", error);
    return new Response("Failed to generate battle image", { status: 500 });
  }
}
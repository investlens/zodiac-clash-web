// app/api/generate-card-portrait/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createAdminClient } from "../../../lib/supabase/admin";
import { buildPortraitPrompt } from "../../../lib/share-card/build-portrait-prompt";

export const runtime = "nodejs";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return new OpenAI({ apiKey });
}

async function generatePortraitWithProvider(prompt: string): Promise<Buffer> {
  const openai = getOpenAIClient();

  const result = await openai.images.generate({
    model: "gpt-image-1-mini",
    prompt,
    size: "1024x1536",
    quality: "low",
    output_format: "png",
  });

  const b64 = result.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error("No image returned from OpenAI");
  }

  return Buffer.from(b64, "base64");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const telegramId = String(body.telegram_id || "");

    if (!telegramId) {
      return NextResponse.json({ error: "Missing telegram_id" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select(`
        telegram_id,
        zodiac,
        archetype,
        traits,
        trait_points,
        gender,
        card_name
      `)
      .eq("telegram_id", telegramId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const prompt = buildPortraitPrompt({
      zodiac: user.zodiac,
      archetype: user.archetype,
      traits: user.traits,
      traitPoints: user.trait_points,
      gender: user.gender,
    });

    await supabase
      .from("users")
      .update({
        card_image_status: "generating",
        card_image_prompt: prompt,
      })
      .eq("telegram_id", telegramId);

    const imageBytes = await generatePortraitWithProvider(prompt);

    const filePath = `users/${telegramId}-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("card-portraits")
      .upload(filePath, imageBytes, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      await supabase
        .from("users")
        .update({ card_image_status: "failed" })
        .eq("telegram_id", telegramId);

      return NextResponse.json(
        { error: "Failed to upload portrait", detail: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("card-portraits")
      .getPublicUrl(filePath);

    await supabase
      .from("users")
      .update({
        card_image_url: publicUrlData.publicUrl,
        card_image_status: "ready",
        card_image_prompt: prompt,
      })
      .eq("telegram_id", telegramId);

    return NextResponse.json({
      ok: true,
      telegram_id: telegramId,
      card_image_url: publicUrlData.publicUrl,
      prompt,
    });
  } catch (error) {
    console.error("POST /api/generate-card-portrait failed", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate portrait",
      },
      { status: 500 }
    );
  }
}
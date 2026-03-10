// lib/telegram/verify.ts
import crypto from "crypto";

export type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
};

export type VerifiedTelegramInitData = {
  user: TelegramUser | null;
  authDate: number | null;
  queryId: string | null;
  raw: string;
};

function createSecretKey(botToken: string) {
  return crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();
}

export function verifyTelegramInitData(
  rawInitData: string,
  botToken: string
): VerifiedTelegramInitData | null {
  if (!rawInitData || !botToken) return null;

  const params = new URLSearchParams(rawInitData);
  const hash = params.get("hash");
  if (!hash) return null;

  const dataCheckString = Array.from(params.entries())
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = createSecretKey(botToken);
  const computedHash = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== hash) {
    return null;
  }

  const userRaw = params.get("user");
  const authDateRaw = params.get("auth_date");
  const queryId = params.get("query_id");

  let user: TelegramUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as TelegramUser;
    } catch {
      user = null;
    }
  }

  return {
    user,
    authDate: authDateRaw ? Number(authDateRaw) : null,
    queryId,
    raw: rawInitData,
  };
}
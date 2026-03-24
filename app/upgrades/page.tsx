import { createAdminClient } from "@/lib/supabase/admin";
import UpgradesClient from "./upgrades-client";

type Props = {
  searchParams: Promise<{
    key?: string;
  }>;
};

export default async function UpgradesPage({ searchParams }: Props) {
  const params = await searchParams;
  const betaKey = params.key;

  if (!process.env.UPGRADES_BETA_KEY || betaKey !== process.env.UPGRADES_BETA_KEY) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Access denied.
      </div>
    );
  }

  const telegramId = process.env.TEST_TELEGRAM_ID;

  if (!telegramId) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Missing TEST_TELEGRAM_ID env variable.
      </div>
    );
  }

  const supabase = createAdminClient();

  const { data: user, error } = await supabase
    .from("users")
    .select(`
      telegram_id,
      first_name,
      username,
      zodiac,
      archetype,
      card_name,
      stardust,
      traits,
      trait_points,
      combat_upgrades
    `)
    .eq("telegram_id", telegramId)
    .single();

  if (error || !user) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Failed to load test user.
      </div>
    );
  }

  return <UpgradesClient user={user} />;
}
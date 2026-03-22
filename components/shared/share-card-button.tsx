"use client";

type ShareCardButtonProps = {
  telegramId?: string | null;
};

export function ShareCardButton({ telegramId }: ShareCardButtonProps) {
  const shareUrl = telegramId
    ? `${window.location.origin}/api/card-image?telegram_id=${telegramId}`
    : "";

  async function handleShare() {
    if (!telegramId) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Zodiac Clash Fighter",
          text: "Check out my Zodiac Clash fighter.",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied!");
    } catch (error) {
      console.error("Share failed", error);
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={!telegramId}
      className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Share Fighter
    </button>
  );
}
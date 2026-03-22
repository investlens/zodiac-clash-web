import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl text-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_40%)] blur-3xl" />
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Zodiac Clash ⚔️
            </h1>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xl font-semibold text-white sm:text-2xl">
              Battle. Earn. Climb.
            </p>
            <p className="mx-auto max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              A Telegram-native battle game evolving into a SUI-powered battle
              ecosystem with progression, rewards, marketplace trading, and
              future premium gameplay on web.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-cyan-500 px-6 py-4 text-lg font-semibold text-black transition hover:bg-cyan-400"
            >
              Open Dashboard
            </Link>

            <a
              href="https://t.me/zodiac_clash_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-lg font-medium text-white transition hover:bg-white/10"
            >
              Open Telegram
            </a>
          </div>
        </div>

        <div className="mt-12 w-full max-w-4xl rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-left shadow-[0_0_40px_rgba(34,211,238,0.08)]">
          <h2 className="text-lg font-semibold">🌊 Built for SUI</h2>
          <p className="mt-2 text-sm leading-7 text-white/70 sm:text-base">
            Zodiac Clash Web is expanding into a SUI-native layer with premium
            battles, player-driven marketplace trading, breeding systems, and
            future ZOD ecosystem rewards.
          </p>
        </div>

        <div className="mt-10 grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-2xl font-semibold">🔥 Live Now</h2>
            <ul className="mt-4 space-y-3 text-base text-white/75">
              <li>⚔️ Arena battles</li>
              <li>🎰 Roulette</li>
              <li>🎁 Daily combo rewards</li>
              <li>🔥 Win streak system</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-2xl font-semibold">🚀 Coming Next</h2>
            <ul className="mt-4 space-y-3 text-base text-white/75">
              <li>🛒 Marketplace (Stardust ↔ SUI)</li>
              <li>🧬 Breeding Lab</li>
              <li>🌊 SUI Premium Battles</li>
              <li>🪙 ZOD Rewards</li>
            </ul>
            <p className="mt-5 text-sm leading-6 text-white/55">
              Built in phases. Early players will be best positioned for the
              next expansion.
            </p>
          </div>
        </div>

        <div className="mt-10 grid w-full max-w-4xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
            <h3 className="text-lg font-semibold">⚡ Fast Battles</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Quick, rewarding matches designed for repeat play and daily habit.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
            <h3 className="text-lg font-semibold">💎 Real Progression</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Build streaks, earn Stardust, unlock boosts, and grow stronger over
              time.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
            <h3 className="text-lg font-semibold">🌌 Expanding Ecosystem</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Marketplace, breeding, premium battles, and future family systems
              will deepen the universe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
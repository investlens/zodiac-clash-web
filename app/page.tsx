import Link from "next/link";

export default function HomePage() {
  const betaKey = process.env.UPGRADES_BETA_KEY;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl text-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_40%)] blur-3xl" />
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Zodiac Clash ⚔️
            </h1>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xl font-semibold text-white sm:text-2xl">
              Battle. Upgrade. Climb.
            </p>
            <p className="mx-auto max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              Train your fighter, spend Stardust wisely, and prepare for the next
              evolution of Zodiac Clash.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/upgrades?key=${betaKey ?? ""}`}
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-cyan-500 px-6 py-4 text-lg font-semibold text-black transition hover:bg-cyan-400"
            >
              ⚡ Upgrade Traits
            </Link>

            <a
              href="https://t.me/zodiac_clash_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-lg font-medium text-white transition hover:bg-white/10"
            >
              Open Telegram Bot
            </a>
          </div>
        </div>

        <div className="mt-12 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-left shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <h2 className="text-xl font-semibold">⚡ Upgrade Lab</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Use Stardust to upgrade Attack, Defense, Crit, Lifesteal, Speed,
              and Recovery.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-xl font-semibold">⚔️ Battle Zone</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Your upgrades impact Arena power in the bot, making every battle
              more strategic.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-xl font-semibold">🌊 Built for SUI</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Web progression now. Wallet, marketplace, premium battles, and ZOD
              systems later.
            </p>
          </div>
        </div>

        <div className="mt-10 grid w-full max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-2xl font-semibold">🔥 Live Now</h2>
            <ul className="mt-4 space-y-3 text-base text-white/75">
              <li>⚔️ 1v1 Arena battles</li>
              <li>🎰 Roulette</li>
              <li>🎁 Daily rewards</li>
              <li>⚡ Trait upgrades on web</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-2xl font-semibold">🚀 Coming Next</h2>
            <ul className="mt-4 space-y-3 text-base text-white/75">
              <li>🏆 Leaderboards</li>
              <li>🧬 Breeding Lab</li>
              <li>🌊 SUI Premium Battles</li>
              <li>🪙 ZOD Forge</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
            <h3 className="text-lg font-semibold">💎 Stardust Utility</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Stardust is no longer just a reward. It now directly strengthens
              your fighter.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
            <h3 className="text-lg font-semibold">📈 Real Progression</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Upgrade smart, improve your battle power, and build toward future
              systems like breeding and family battles.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
            <h3 className="text-lg font-semibold">🌌 Expanding Universe</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Zodiac Clash starts in Telegram, grows on web, and evolves into a
              deeper ecosystem over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
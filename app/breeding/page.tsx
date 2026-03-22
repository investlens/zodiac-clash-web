import Link from "next/link";
import { ArrowRight, Dna, Sparkles, ShieldCheck } from "lucide-react";

export default function BreedingPage() {
  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">🧬 Breeding Lab</h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Combine fighters to create new bloodlines with inherited traits,
            unique identities, and future family battle potential.
          </p>
        </div>

        <div className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/5 p-6">
          <div className="flex items-center gap-3">
            <Dna className="h-5 w-5 text-fuchsia-300" />
            <h2 className="text-lg font-semibold">Bloodline Creation</h2>
          </div>

          <p className="mt-2 text-sm text-white/70">
            Select two parents, preview the breeding success chance, and create
            offspring with inherited traits and future battle utility.
          </p>

          <p className="mt-3 text-xs text-white/50">
            Breeding will consume Stardust and later support advanced boosts and
            deeper family systems.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">✨ Preview Flow</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Parent A
              </p>
              <p className="mt-2 text-lg font-semibold">Aries — Solar Fang</p>
              <p className="mt-1 text-sm text-white/60">
                Trait focus: Crit / Aggression
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Parent B
              </p>
              <p className="mt-2 text-lg font-semibold">Pisces — Moon Tide</p>
              <p className="mt-1 text-sm text-white/60">
                Trait focus: Heal / Recovery
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">🔮 Breeding Preview</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <p className="text-sm font-medium">Success Chance</p>
              </div>
              <p className="mt-2 text-2xl font-semibold">72%</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                <p className="text-sm font-medium">Cost</p>
              </div>
              <p className="mt-2 text-2xl font-semibold">50 Stardust</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2">
                <Dna className="h-4 w-4 text-fuchsia-300" />
                <p className="text-sm font-medium">Potential Inheritance</p>
              </div>
              <p className="mt-2 text-sm text-white/70">
                Crit boost, recovery trait, hybrid bloodline bonus
              </p>
            </div>
          </div>

          <button className="mt-6 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20">
            Breed Now (Coming Soon)
          </button>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">
          <h2 className="text-xl font-semibold">👨‍👩‍👧 Future Family Battles</h2>
          <p className="mt-2 text-sm leading-7 text-white/70">
            Offspring created through the Breeding Lab will later be usable in
            family battle modes, bloodline bonuses, and deeper progression
            systems inside Zodiac Clash Web.
          </p>
        </div>

        <div className="text-sm text-white/50">
          Breeding is launching in phases. Early players will be best positioned
          to build strong bloodlines and future family synergies.
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-cyan-400"
        >
          ← Back to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
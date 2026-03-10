import { AppShell } from "../../components/layout/app-shell";
import { SectionCard } from "../../components/shared/section-card";
import { cardsMock } from "../../lib/mock-data";
import { FeaturedCard } from "../../components/cards/featured-card";
import { CardTile } from "../../components/cards/card-tile";

export default function CardsPage() {
  const { featured, collection } = cardsMock;
  const ownedCount = collection.filter((card) => card.owned).length;

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Card Collection
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cards</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Your active fighters, origin collection, and future unlocks in one
            premium vault.
          </p>
        </div>

        <FeaturedCard card={featured} />

        <SectionCard eyebrow="Collection" title={`${ownedCount}/${collection.length} Cards Visible`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {collection.map((card) => (
              <CardTile key={card.id} card={card} />
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
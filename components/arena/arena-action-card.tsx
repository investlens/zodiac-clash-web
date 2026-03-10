type ArenaActionCardProps = {
  item: {
    title: string;
    subtitle: string;
    value: string;
  };
};

export function ArenaActionCard({ item }: ArenaActionCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.06]">
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
        {item.value}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-white/65">{item.subtitle}</p>
    </div>
  );
}
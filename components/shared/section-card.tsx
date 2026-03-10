// components/shared/section-card.tsx
import clsx from "clsx";

export function SectionCard({
  title,
  eyebrow,
  children,
  className,
}: {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl",
        className
      )}
    >
      {(eyebrow || title) && (
        <div className="mb-4">
          {eyebrow ? (
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
          ) : null}
        </div>
      )}

      {children}
    </section>
  );
}
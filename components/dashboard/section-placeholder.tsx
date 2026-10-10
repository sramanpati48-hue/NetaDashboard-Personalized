import { cn } from "@/lib/utils";

interface SectionPlaceholderProps {
  title: string;
  phase: number;
  className?: string;
}

/** Phase 1 layout scaffold; each instance is replaced by its real section in a later phase. */
export function SectionPlaceholder({ title, phase, className }: SectionPlaceholderProps) {
  return (
    <section
      aria-label={`${title} (coming in phase ${phase})`}
      className={cn(
        "hn-card flex min-w-0 items-center justify-center border-dashed p-4 shadow-none",
        className,
      )}
    >
      <div className="text-center">
        <p className="hn-section-title">{title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">Phase {phase}</p>
      </div>
    </section>
  );
}

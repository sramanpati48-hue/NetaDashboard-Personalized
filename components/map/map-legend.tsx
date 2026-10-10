import { cn } from "@/lib/utils";

interface MapLegendProps {
  showHeatmap: boolean;
  engine: "maplibre" | "preview";
  className?: string;
}

export function MapLegend({ showHeatmap, engine, className }: MapLegendProps) {
  return (
    <div className={cn("flex flex-col items-start gap-1.5", className)}>
      {showHeatmap ? (
        <div className="rounded-control border border-line bg-white/96 px-3 py-2 shadow-raised backdrop-blur-sm">
          <p className="text-[0.6875rem] font-semibold text-navy">Complaint density</p>
          <div
            aria-hidden="true"
            className="mt-1.5 h-2 w-36 rounded-full bg-[linear-gradient(90deg,rgb(255_196_120/0.35),#ffb14a,#ff7a18,#ef4444,#b91c1c)]"
          />
          <div className="mt-1 flex justify-between text-[0.625rem] text-ink-muted">
            <span>Lower density</span>
            <span>Higher density</span>
          </div>
          <p className="mt-1 text-[0.625rem] text-ink-muted">Indicative · aggregated demo data</p>
        </div>
      ) : null}
      {engine === "preview" ? (
        <span className="rounded-full border border-line bg-white/92 px-2 py-0.5 text-[0.625rem] font-medium tracking-wide text-ink-muted shadow-sm">
          Map preview mode
        </span>
      ) : null}
    </div>
  );
}

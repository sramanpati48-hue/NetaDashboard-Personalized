import { MapPin, Sun } from "lucide-react";
import type { WeatherSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
  weather: WeatherSnapshot;
  className?: string;
}

export function WeatherWidget({ weather, className }: WeatherWidgetProps) {
  return (
    <section
      aria-label="Today's date and weather"
      className={cn(
        "flex items-center gap-3 rounded-card border border-white/80 bg-white/80 px-3.5 py-3 shadow-card backdrop-blur-sm",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[0.8125rem] font-semibold text-navy">{weather.dateLabel}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
          <MapPin aria-hidden="true" className="size-3 shrink-0 text-saffron" />
          <span className="truncate">{weather.location}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 border-l border-line pl-3">
        <Sun aria-hidden="true" className="size-7 text-warning" strokeWidth={1.75} />
        <div className="leading-tight">
          <p className="text-lg font-semibold text-navy tabular-nums">
            {weather.temperatureC}°C
          </p>
          <p className="text-xs text-ink-muted">{weather.condition}</p>
        </div>
      </div>
    </section>
  );
}

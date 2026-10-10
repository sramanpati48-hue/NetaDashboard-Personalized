"use client";

import { ChevronDown, Layers } from "lucide-react";
import { useId, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { MAP_LAYERS } from "@/lib/map-config";
import type { MapLayerId } from "@/lib/types";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import type { LayerVisibility } from "./use-command-map-state";

interface MapLayerControlProps {
  layers: LayerVisibility;
  counts: Record<MapLayerId, number>;
  onToggle: (id: MapLayerId, visible: boolean) => void;
  /** Start expanded regardless of screen size (full-page map). */
  defaultExpanded?: boolean;
  className?: string;
}

export function MapLayerControl({
  layers,
  counts,
  onToggle,
  defaultExpanded = false,
  className,
}: MapLayerControlProps) {
  const isRoomy = useMediaQuery("(min-width: 768px) and (min-height: 560px)");
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null);
  const expanded = userExpanded ?? (defaultExpanded || isRoomy);
  const panelId = useId();
  const visibleCount = MAP_LAYERS.filter((layer) => layers[layer.id]).length;

  return (
    <section
      aria-label="Map layers"
      className={cn(
        "max-w-[calc(100%-10rem)] overflow-hidden rounded-card border border-line bg-white/96 shadow-raised backdrop-blur-sm sm:max-w-none",
        expanded ? "w-[13.25rem]" : "w-auto",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setUserExpanded(!expanded)}
        className="hn-focus-ring flex min-h-11 w-full items-center gap-2 px-3 text-left lg:min-h-10"
      >
        <Layers aria-hidden="true" className="size-4 text-navy" />
        <span className="flex-1 text-[0.8125rem] font-semibold text-navy">All Layers</span>
        <span className="rounded-full bg-canvas px-1.5 py-0.5 text-[0.6875rem] font-medium text-ink-muted tabular-nums ring-1 ring-line">
          {visibleCount}/{MAP_LAYERS.length}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 text-ink-muted transition-transform motion-reduce:transition-none",
            expanded && "rotate-180",
          )}
        />
      </button>

      <ul id={panelId} hidden={!expanded} className="border-t border-line px-1.5 py-1.5">
        {MAP_LAYERS.map((layer) => {
          const Icon = layer.icon;
          const checked = layers[layer.id];
          const checkboxId = `${panelId}-${layer.id}`;
          return (
            <li key={layer.id}>
              <label
                htmlFor={checkboxId}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-control px-1.5 transition-colors hover:bg-canvas lg:min-h-9",
                  !checked && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex size-6.5 shrink-0 items-center justify-center rounded-md",
                    layer.tileClass,
                  )}
                >
                  <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium text-ink">
                  {layer.label}
                </span>
                <span className="text-[0.6875rem] text-ink-muted tabular-nums">
                  {counts[layer.id]}
                </span>
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  onCheckedChange={(value) => onToggle(layer.id, value === true)}
                  className="size-4.5 data-checked:border-navy data-checked:bg-navy"
                />
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

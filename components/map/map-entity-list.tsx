"use client";

import { ChevronRight, EyeOff, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MAP_LAYER_BY_ID } from "@/lib/map-config";
import type { MapMarker } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapSearchField } from "./map-search-field";
import { StatusBadge } from "./status-badge";

interface MapEntityListProps {
  markers: readonly MapMarker[];
  selectedId: string | null;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (marker: MapMarker) => void;
  noLayersVisible: boolean;
  onShowAllLayers: () => void;
  /** Hide the built-in filter when the page already has one. */
  showSearch?: boolean;
  className?: string;
}

export function MapEntityList({
  markers,
  selectedId,
  query,
  onQueryChange,
  onSelect,
  noLayersVisible,
  onShowAllLayers,
  showSearch = true,
  className,
}: MapEntityListProps) {
  return (
    <div className={cn("flex min-h-0 flex-col bg-white", className)}>
      <div className="flex flex-col gap-2 border-b border-line px-3 pt-3 pb-2.5 sm:px-4">
        {showSearch ? <MapSearchField value={query} onChange={onQueryChange} /> : null}
        <p className="text-xs text-ink-muted" aria-live="polite">
          {markers.length} {markers.length === 1 ? "entity" : "entities"} in visible layers
        </p>
      </div>

      {noLayersVisible ? (
        <EmptyState
          icon={<EyeOff aria-hidden="true" className="size-5" />}
          title="All layers are hidden"
          description="Turn on at least one layer to list constituency entities."
          action={
            <Button variant="outline" size="sm" onClick={onShowAllLayers}>
              Show all layers
            </Button>
          }
        />
      ) : markers.length === 0 ? (
        <EmptyState
          icon={<SearchX aria-hidden="true" className="size-5" />}
          title={`No results for “${query.trim()}”`}
          description="Try a ward, locality or status, such as Gokulpuri or Delayed."
          action={
            <Button variant="outline" size="sm" onClick={() => onQueryChange("")}>
              Clear filter
            </Button>
          }
        />
      ) : (
        <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto overscroll-contain">
          {markers.map((marker) => {
            const layer = MAP_LAYER_BY_ID[marker.layerId];
            const Icon = layer.icon;
            const selected = marker.id === selectedId;
            return (
              <li key={marker.id}>
                <button
                  type="button"
                  onClick={() => onSelect(marker)}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "hn-focus-ring flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-canvas sm:px-4",
                    selected && "bg-canvas",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-control",
                      layer.tileClass,
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] font-semibold text-navy">
                      {marker.title}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">
                      {layer.entityLabel} · {marker.subtitle}
                    </span>
                  </span>
                  {marker.status ? (
                    <StatusBadge status={marker.status} className="hidden sm:inline-flex" />
                  ) : null}
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-canvas text-ink-muted ring-1 ring-line">
        {icon}
      </span>
      <p className="text-sm font-semibold text-navy">{title}</p>
      <p className="max-w-xs text-xs text-ink-muted">{description}</p>
      <div className="mt-1">{action}</div>
    </div>
  );
}

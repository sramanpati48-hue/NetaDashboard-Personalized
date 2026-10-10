"use client";

import { MAP_LAYER_BY_ID } from "@/lib/map-config";
import type { MapMarker as MapMarkerData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MapMarkerProps {
  marker: MapMarkerData;
  selected: boolean;
  onSelect: (id: string) => void;
  className?: string;
}

/** Pin anchored at its bottom-centre tip; position the wrapper at the coordinate. */
export function MapMarker({ marker, selected, onSelect, className }: MapMarkerProps) {
  const layer = MAP_LAYER_BY_ID[marker.layerId];
  const Icon = layer.icon;

  return (
    <button
      type="button"
      data-map-marker={marker.id}
      aria-label={`${layer.entityLabel}: ${marker.title}, ${marker.subtitle}`}
      aria-pressed={selected}
      title={marker.title}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(marker.id);
      }}
      className={cn(
        "group/marker relative flex flex-col items-center outline-none",
        "transition-transform duration-150 ease-out motion-reduce:transition-none",
        selected ? "z-10 scale-115" : "hover:-translate-y-0.5 hover:scale-108",
        className,
      )}
      style={{ ["--marker-color" as string]: layer.color }}
    >
      <span
        className={cn(
          "relative flex size-8 items-center justify-center rounded-full border-2 border-white bg-(--marker-color) text-white",
          "shadow-[0_3px_8px_-2px_rgb(11_27_69/0.45)]",
          "group-focus-visible/marker:outline-2 group-focus-visible/marker:outline-offset-2 group-focus-visible/marker:outline-info",
          selected &&
            "shadow-[0_0_0_4px_color-mix(in_oklab,var(--marker-color)_28%,transparent),0_6px_14px_-4px_rgb(11_27_69/0.55)]",
        )}
      >
        <Icon aria-hidden="true" className="size-4" strokeWidth={2.25} />
      </span>
      <span
        aria-hidden="true"
        className="-mt-[3px] size-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-(--marker-color) drop-shadow-[0_1px_0_white]"
      />
    </button>
  );
}

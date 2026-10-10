"use client";

import {
  ArrowUpRight,
  CircleAlert,
  Compass,
  EyeOff,
  Flame,
  Maximize2,
  MousePointerClick,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { MAP_LAYERS, MAP_STYLE, MAP_STYLE_URL } from "@/lib/map-config";
import {
  COMPLAINT_DENSITY,
  CONSTITUENCY_BOUNDARY,
  MAP_AREA_LABELS,
  MAP_MARKERS,
} from "@/lib/mock-data";
import type { MapMarker } from "@/lib/types";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { MapControls } from "./map-controls";
import { MapEntityList } from "./map-entity-list";
import { MapFallback, type MapEngineProps } from "./map-fallback";
import { MapLayerControl } from "./map-layer-control";
import { MapLegend } from "./map-legend";
import { MapLoadingState } from "./map-loading-state";
import { MapModeSwitcher } from "./map-mode-switcher";
import { MapSearchField } from "./map-search-field";
import { ProjectDetailsSheet } from "./project-details-sheet";
import { MapSelectionPopup } from "./project-map-popup";
import {
  useCommandMapState,
  useMapExpanded,
  type MapViewportApi,
} from "./use-command-map-state";

const MapLibreClient = dynamic(() => import("./map-libre-client"), {
  ssr: false,
  loading: () => <MapLoadingState />,
});

type EngineStatus = "loading" | "ready" | "error";

interface ConstituencyCommandMapProps {
  /** "full" is the spacious /dashboard/constituency layout with a detail panel. */
  variant?: "dashboard" | "full";
  className?: string;
}

export function ConstituencyCommandMap({ variant = "dashboard", className }: ConstituencyCommandMapProps) {
  const isFull = variant === "full";
  const map = useCommandMapState({ markers: MAP_MARKERS, queryFiltersMap: isFull });
  const { expanded, toggle: toggleExpanded, collapse } = useMapExpanded();
  const apiRef = useRef<MapViewportApi>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>("loading");
  const isTabletUp = useMediaQuery("(min-width: 768px)");
  const isLaptopUp = useMediaQuery("(min-width: 1024px)");

  const engine = engineStatus !== "error" && MAP_STYLE ? "maplibre" : "preview";
  const isHeatmap = map.mode === "heatmap";
  const isList = map.mode === "list";
  const engineMarkers = isHeatmap
    ? map.mapMarkers.filter((marker) => marker.layerId === "complaints")
    : map.mapMarkers;
  const selected = engineMarkers.find((marker) => marker.id === map.selectedMarker?.id) ?? null;
  const showHeat = isHeatmap && map.layers.complaints;
  const hasDetailPanel = isFull && isLaptopUp && !expanded;
  const showFloatingPopup = Boolean(selected) && !isList && isTabletUp && !hasDetailPanel;
  const showSheetPopup = Boolean(selected) && !isList && !isTabletUp;

  useEffect(() => {
    if (showFloatingPopup) popupRef.current?.focus({ preventScroll: true });
  }, [showFloatingPopup, selected?.id]);

  function closePopup() {
    const id = selected?.id;
    map.select(null);
    if (id) document.querySelector<HTMLElement>(`[data-map-marker="${id}"]`)?.focus();
  }

  function selectFromList(marker: MapMarker) {
    map.select(marker.id);
    map.setMode("map");
    apiRef.current?.focus(marker);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || !event.currentTarget.contains(event.target as Node)) return;
    if (selected) {
      event.stopPropagation();
      closePopup();
    } else if (expanded) {
      event.stopPropagation();
      collapse();
    }
  }

  const engineProps: MapEngineProps = {
    markers: engineMarkers,
    labels: MAP_AREA_LABELS,
    boundary: CONSTITUENCY_BOUNDARY,
    density: COMPLAINT_DENSITY,
    showHeat,
    selectedId: selected?.id ?? null,
    onSelect: map.select,
    freeWheelZoom: isFull || expanded,
    captureTouch: isFull || expanded,
    apiRef,
  };

  return (
    <>
      {expanded ? (
        <div aria-hidden="true" className="fixed inset-0 z-44 bg-navy-deep/45" onClick={collapse} />
      ) : null}

      <div
        className={cn(
          "flex min-w-0 flex-col gap-4",
          isFull && "lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start",
          className,
        )}
      >
        <section
          aria-labelledby={`${variant}-map-title`}
          onKeyDown={handleKeyDown}
          className={cn(
            "hn-card flex min-w-0 flex-col overflow-hidden",
            expanded && "fixed inset-2 z-45 shadow-raised sm:inset-4",
          )}
        >
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#4f46e5] text-white shadow-xs">
                <Compass aria-hidden="true" className="size-3.5" />
              </span>
              <div>
                <h2 id={`${variant}-map-title`} className="text-sm font-bold text-navy leading-none">
                  Constituency Command Map
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Live view of complaints, development works, assets and outreach across North East Delhi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapModeSwitcher
                mode={map.mode}
                onChange={map.setMode}
                className="border border-line/80 bg-canvas/80 shadow-none p-0.5"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleExpanded}
                className="size-8 rounded-control border-line bg-white text-navy hover:bg-canvas"
                title={expanded ? "Collapse map" : "Expand map"}
              >
                <Maximize2 aria-hidden="true" className="size-3.5" />
              </Button>
            </div>
          </header>

          <div
            className={cn(
              "relative isolate min-h-0 overflow-hidden",
              expanded
                ? "flex-1"
                : isFull
                  ? "h-[max(26rem,calc(100dvh-15rem))]"
                  : "w-full h-[380px] sm:h-[400px] lg:h-[440px]",
            )}
          >
            {engine === "maplibre" && MAP_STYLE ? (
              <MapLibreClient
                {...engineProps}
                style={MAP_STYLE}
                onReady={() => setEngineStatus("ready")}
                onError={() => setEngineStatus("error")}
              />
            ) : (
              <MapFallback {...engineProps} />
            )}
            {engine === "maplibre" && engineStatus === "loading" ? <MapLoadingState /> : null}

            {map.visibleLayerCount === 0 && !isList ? (
              <MapNotice
                icon={<EyeOff aria-hidden="true" className="size-4.5" />}
                title="All layers are hidden"
                description="Turn a layer back on to see constituency activity."
                actionLabel="Show all layers"
                onAction={map.showAllLayers}
              />
            ) : isHeatmap && !map.layers.complaints ? (
              <MapNotice
                icon={<Flame aria-hidden="true" className="size-4.5" />}
                title="Complaints layer is off"
                description="The heatmap shows complaint density. Turn the layer on to view it."
                actionLabel="Show complaints"
                onAction={() => map.toggleLayer("complaints", true)}
              />
            ) : null}

            {isList ? (
              <div className="absolute inset-0 z-5 flex flex-col bg-canvas pt-15 md:pl-60">
                <MapEntityList
                  markers={map.listMarkers}
                  selectedId={map.selectedMarker?.id ?? null}
                  query={map.query}
                  onQueryChange={map.setQuery}
                  onSelect={selectFromList}
                  noLayersVisible={map.visibleLayerCount === 0}
                  onShowAllLayers={map.showAllLayers}
                  showSearch={!isFull}
                  className="min-h-0 flex-1 border-t border-line md:border-l"
                />
              </div>
            ) : null}

            {!isList && (
              <MapLayerControl
                layers={map.layers}
                counts={map.layerCounts}
                onToggle={map.toggleLayer}
                defaultExpanded={isFull || isLaptopUp}
                className="absolute top-3 left-3 z-20"
              />
            )}

            {!isList ? (
              <>
                <MapControls
                  onZoomIn={() => apiRef.current?.zoomIn()}
                  onZoomOut={() => apiRef.current?.zoomOut()}
                  onRecenter={() => apiRef.current?.recenter()}
                  onToggleExpanded={toggleExpanded}
                  expanded={expanded}
                  className="absolute right-3 bottom-3 z-20"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex max-w-[calc(100%-8rem)] flex-col items-start gap-1.5 [&>*]:pointer-events-auto">
                  {engineStatus === "error" ? (
                    <p
                      role="status"
                      className="flex items-start gap-1.5 rounded-control border border-warning/40 bg-white px-2.5 py-1.5 text-[0.6875rem] font-medium text-[#92400e] shadow-raised"
                    >
                      <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                      Map data is temporarily unavailable. Showing constituency preview.
                    </p>
                  ) : null}
                  <MapLegend showHeatmap={showHeat} engine={engine} />
                </div>
              </>
            ) : null}

            {showFloatingPopup && selected ? (
              <MapSelectionPopup
                ref={popupRef}
                marker={selected}
                onClose={closePopup}
                onViewProject={map.openProject}
                floating={true}
                className={cn(
                  "absolute z-30 transition-all",
                  isFull
                    ? "top-15 right-16 max-h-[calc(100%-4.5rem)] w-72 max-w-[85%] lg:right-14"
                    : "top-[26%] left-[53%] -translate-y-1/2 w-[24rem] max-w-[calc(100%-15rem)]",
                )}
              />
            ) : null}
          </div>
        </section>

        {isFull ? (
          <MapDetailPanel
            marker={hasDetailPanel ? (map.selectedMarker ?? null) : null}
            counts={map.layerCounts}
            onClose={() => map.select(null)}
            onViewProject={map.openProject}
            className="hidden lg:flex"
          />
        ) : null}
      </div>

      <Sheet open={showSheetPopup} onOpenChange={(open) => (open ? undefined : map.select(null))}>
        <SheetContent side="bottom" className="max-h-[85dvh] gap-0 overflow-y-auto rounded-t-card">
          <SheetTitle className="sr-only">{selected?.title ?? "Map entity"} details</SheetTitle>
          {selected ? (
            <MapSelectionPopup
              marker={selected}
              onViewProject={map.openProject}
              floating={false}
              className="pt-1"
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <ProjectDetailsSheet projectId={map.projectId} onClose={map.closeProject} />
    </>
  );
}

function MapNotice({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
      <div
        role="status"
        className="pointer-events-auto flex max-w-xs flex-col items-center gap-2 rounded-card border border-line bg-white/96 px-5 py-4 text-center shadow-raised backdrop-blur-sm"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-canvas text-ink-muted ring-1 ring-line">
          {icon}
        </span>
        <p className="text-sm font-semibold text-navy">{title}</p>
        <p className="text-xs text-ink-muted">{description}</p>
        <Button size="sm" onClick={onAction} className="mt-1 bg-navy hover:bg-navy/90">
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

function MapDetailPanel({
  marker,
  counts,
  onClose,
  onViewProject,
  className,
}: {
  marker: MapMarker | null;
  counts: Record<MapMarker["layerId"], number>;
  onClose: () => void;
  onViewProject: (projectId: string) => void;
  className?: string;
}) {
  return (
    <aside aria-label="Selected entity" className={cn("flex-col gap-4", className)}>
      {marker ? (
        <MapSelectionPopup marker={marker} onClose={onClose} onViewProject={onViewProject} />
      ) : (
        <div className="hn-card flex flex-col items-center gap-2 px-5 py-8 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-canvas text-ink-muted ring-1 ring-line">
            <MousePointerClick aria-hidden="true" className="size-4.5" />
          </span>
          <p className="text-sm font-semibold text-navy">Select a marker</p>
          <p className="text-xs text-ink-muted">
            Choose any marker or list entry to see its status, ward and next action here.
          </p>
        </div>
      )}

      <div className="hn-card p-4">
        <h3 className="hn-eyebrow">Constituency summary</h3>
        <ul className="mt-3 flex flex-col gap-2.5">
          {MAP_LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <li key={layer.id} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md",
                    layer.tileClass,
                  )}
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                </span>
                <span className="flex-1 text-[0.8125rem] text-ink">{layer.label}</span>
                <span className="text-[0.8125rem] font-semibold text-navy tabular-nums">
                  {counts[layer.id]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

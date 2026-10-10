"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MAP_LAYER_BY_ID, MAP_LAYERS } from "@/lib/map-config";
import type { MapLayerId, MapMarker, MapMode } from "@/lib/types";

export type LayerVisibility = Record<MapLayerId, boolean>;

const ALL_LAYERS_ON = Object.fromEntries(
  MAP_LAYERS.map((layer) => [layer.id, true]),
) as LayerVisibility;

function matchesQuery(marker: MapMarker, query: string) {
  if (!query) return true;
  const haystack = [
    marker.title,
    marker.subtitle,
    marker.ward,
    marker.status,
    MAP_LAYER_BY_ID[marker.layerId].label,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

interface Options {
  markers: readonly MapMarker[];
  /** When true the search text filters map markers too, not only the list. */
  queryFiltersMap: boolean;
}

export function useCommandMapState({ markers, queryFiltersMap }: Options) {
  const [mode, setMode] = useState<MapMode>("map");
  const [layers, setLayers] = useState<LayerVisibility>(ALL_LAYERS_ON);
  const [selectedId, setSelectedId] = useState<string | null>("mk-work-road-resurfacing");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const normalisedQuery = query.trim().toLowerCase();

  const layerMarkers = useMemo(
    () => markers.filter((marker) => layers[marker.layerId]),
    [markers, layers],
  );
  const listMarkers = useMemo(
    () => layerMarkers.filter((marker) => matchesQuery(marker, normalisedQuery)),
    [layerMarkers, normalisedQuery],
  );
  const mapMarkers = queryFiltersMap ? listMarkers : layerMarkers;

  const layerCounts = useMemo(() => {
    const counts = Object.fromEntries(MAP_LAYERS.map((layer) => [layer.id, 0])) as Record<
      MapLayerId,
      number
    >;
    for (const marker of markers) counts[marker.layerId] += 1;
    return counts;
  }, [markers]);

  /* A selection disappears with its layer instead of lingering as a hidden popup. */
  const selectedMarker = mapMarkers.find((marker) => marker.id === selectedId) ?? null;
  const visibleLayerCount = MAP_LAYERS.filter((layer) => layers[layer.id]).length;

  const toggleLayer = useCallback((id: MapLayerId, visible: boolean) => {
    setLayers((current) => ({ ...current, [id]: visible }));
  }, []);
  const showAllLayers = useCallback(() => setLayers(ALL_LAYERS_ON), []);
  const select = useCallback((id: string | null) => setSelectedId(id), []);
  const openProject = useCallback((id: string) => setProjectId(id), []);
  const closeProject = useCallback(() => setProjectId(null), []);

  return {
    mode,
    setMode,
    layers,
    toggleLayer,
    showAllLayers,
    visibleLayerCount,
    layerCounts,
    query,
    setQuery,
    listMarkers,
    mapMarkers,
    selectedMarker,
    select,
    projectId,
    openProject,
    closeProject,
  };
}

/*
 * Expands the map card to cover the viewport. An in-page overlay is used
 * instead of the Fullscreen API so portalled sheets and tooltips stay visible.
 */
export function useMapExpanded() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [expanded]);

  const toggle = useCallback(() => setExpanded((value) => !value), []);
  const collapse = useCallback(() => setExpanded(false), []);
  return { expanded, toggle, collapse };
}

export interface MapViewportApi {
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
  focus: (marker: MapMarker) => void;
}

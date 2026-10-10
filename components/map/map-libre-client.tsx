"use client";

import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

if (typeof window !== "undefined") {
  maplibregl.setWorkerUrl("/maplibre-gl-worker.js");
}
import {
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MAP_VIEW } from "@/lib/map-config";
import { MAP_MARKERS } from "@/lib/mock-data";
import type { MapEngineProps } from "./map-fallback";
import { AreaLabelText } from "./map-fallback";
import { MapMarker } from "./map-marker";

interface MapLibreClientProps extends MapEngineProps {
  style: string | maplibregl.StyleSpecification;
  onReady: () => void;
  onError: () => void;
}

const BOUNDARY_SOURCE = "hn-boundary";
const DENSITY_SOURCE = "hn-complaint-density";
const HEAT_LAYER = "hn-complaint-heat";
const LOAD_TIMEOUT_MS = 15000;

export default function MapLibreClient({
  style,
  markers,
  labels,
  boundary,
  density,
  showHeat,
  selectedId,
  onSelect,
  freeWheelZoom,
  apiRef,
  onReady,
  onError,
}: MapLibreClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  /* One stable DOM host per known entity; React portals render the shared pin into it. */
  const hosts = useMemo(
    () => new Map(MAP_MARKERS.map((marker) => [marker.id, document.createElement("div")])),
    [],
  );
  const labelHosts = useMemo(
    () => new Map(labels.map((label) => [label.id, document.createElement("div")])),
    [labels],
  );

  const handleReady = useEffectEvent(() => onReady());
  const handleError = useEffectEvent(() => onError());
  const handleBackgroundClick = useEffectEvent(() => onSelect(null));
  const initialBoundary = useEffectEvent(() => boundary);
  const initialDensity = useEffectEvent(() => density);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let loaded = false;
    let instance: maplibregl.Map;
    try {
      console.log("[MapLibreClient] Initializing MapLibre instance with style:", typeof style);
      instance = new maplibregl.Map({
        container,
        style,
        bounds: MAP_VIEW.fitBounds,
        fitBoundsOptions: { padding: 28 },
        minZoom: MAP_VIEW.minZoom,
        maxZoom: MAP_VIEW.maxZoom,
        maxPitch: 0,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        cooperativeGestures: !freeWheelZoom,
        attributionControl: { compact: true },
        canvasContextAttributes: {
          preserveDrawingBuffer: true,
        },
      });
    } catch (err) {
      console.error("[MapLibreClient] Construction failed:", err);
      handleError();
      return;
    }
    instance.touchZoomRotate.disableRotation();
    instance.keyboard.disableRotation();

    const timeout = window.setTimeout(() => {
      if (!loaded) {
        console.warn("[MapLibreClient] Load timed out after", LOAD_TIMEOUT_MS, "ms");
        handleError();
      }
    }, LOAD_TIMEOUT_MS);

    instance.on("error", (e) => {
      if (loaded) return;
      const msg = (e?.error?.message || "").toLowerCase();
      if (msg.includes("tile") || (e as { status?: number })?.status === 404) return;
      console.warn("[MapLibreClient] Map warning/error event:", e);
    });

    instance.on("load", () => {
      console.log("[MapLibreClient] Map load event fired successfully!");
      loaded = true;
      window.clearTimeout(timeout);

      instance.addSource(BOUNDARY_SOURCE, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: initialBoundary() },
      });
      instance.addLayer({
        id: "hn-boundary-fill",
        type: "fill",
        source: BOUNDARY_SOURCE,
        paint: { "fill-color": "#312e81", "fill-opacity": 0.08 },
      });
      instance.addLayer({
        id: "hn-boundary-halo",
        type: "line",
        source: BOUNDARY_SOURCE,
        paint: { "line-color": "#4f46e5", "line-width": 6, "line-opacity": 0.75, "line-blur": 2 },
      });
      instance.addLayer({
        id: "hn-boundary-inner",
        type: "line",
        source: BOUNDARY_SOURCE,
        paint: { "line-color": "#818cf8", "line-width": 2.5 },
      });
      instance.addLayer({
        id: "hn-boundary-line",
        type: "line",
        source: BOUNDARY_SOURCE,
        paint: { "line-color": "#ffffff", "line-width": 1.5, "line-dasharray": [4, 3] },
      });

      instance.addSource(DENSITY_SOURCE, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: initialDensity().map((point) => ({
            type: "Feature",
            properties: { weight: point.weight },
            geometry: { type: "Point", coordinates: [point.longitude, point.latitude] },
          })),
        },
      });
      instance.addLayer({
        id: HEAT_LAYER,
        type: "heatmap",
        source: DENSITY_SOURCE,
        layout: { visibility: "none" },
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 15, 2],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 18, 13, 42, 16, 90],
          "heatmap-opacity": 0.85,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(255,196,120,0)",
            0.2,
            "rgba(255,196,120,0.45)",
            0.45,
            "rgba(255,160,70,0.65)",
            0.7,
            "rgba(255,122,24,0.78)",
            0.88,
            "rgba(239,68,68,0.85)",
            1,
            "rgba(185,28,28,0.9)",
          ],
        },
      });

      setMap(instance);
      handleReady();
    });

    instance.on("click", (event) => {
      const target = event.originalEvent.target;
      if (target instanceof Element && target.closest("[data-map-marker]")) return;
      handleBackgroundClick();
    });

    return () => {
      window.clearTimeout(timeout);
      instance.remove();
      setMap(null);
    };
  }, [style, freeWheelZoom]);

  useEffect(() => {
    if (!map) return;
    map.setLayoutProperty(HEAT_LAYER, "visibility", showHeat ? "visible" : "none");
  }, [map, showHeat]);

  useEffect(() => {
    if (!map) return;
    const instances = labels.map((label) => {
      const element = labelHosts.get(label.id);
      if (!element) return null;
      return new maplibregl.Marker({ element, anchor: "center", className: "pointer-events-none" })
        .setLngLat([label.longitude, label.latitude])
        .addTo(map);
    });
    return () => instances.forEach((instance) => instance?.remove());
  }, [map, labels, labelHosts]);

  const markerInstances = useRef(new Map<string, maplibregl.Marker>());

  useEffect(() => {
    if (!map) return;
    const instances = markerInstances.current;
    for (const marker of markers) {
      const element = hosts.get(marker.id);
      if (!element) continue;
      instances.set(
        marker.id,
        new maplibregl.Marker({ element, anchor: "bottom" })
          .setLngLat([marker.longitude, marker.latitude])
          .addTo(map),
      );
    }
    return () => {
      instances.forEach((instance) => instance.remove());
      instances.clear();
    };
  }, [map, markers, hosts]);

  useEffect(() => {
    for (const [id, instance] of markerInstances.current) {
      instance.getElement().style.zIndex = id === selectedId ? "5" : "";
    }
  }, [map, markers, selectedId]);

  useImperativeHandle(
    apiRef,
    () => ({
      zoomIn: () => map?.zoomIn(),
      zoomOut: () => map?.zoomOut(),
      recenter: () => map?.fitBounds(MAP_VIEW.fitBounds, { padding: 24 }),
      focus: (marker) =>
        map?.easeTo({
          center: [marker.longitude, marker.latitude],
          zoom: Math.max(map.getZoom(), 13.5),
        }),
    }),
    [map],
  );

  return (
    <>
      <div
        ref={containerRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        className="inset-0 bg-[#1e293b] [&_.maplibregl-ctrl-attrib]:text-[0.625rem]"
      />
      {map
        ? markers.map((marker) => {
            const element = hosts.get(marker.id);
            return element
              ? createPortal(
                  <MapMarker
                    marker={marker}
                    selected={marker.id === selectedId}
                    onSelect={onSelect}
                  />,
                  element,
                  marker.id,
                )
              : null;
          })
        : null}
      {map
        ? labels.map((label) => {
            const element = labelHosts.get(label.id);
            return element ? createPortal(<AreaLabelText label={label} />, element, label.id) : null;
          })
        : null}
    </>
  );
}

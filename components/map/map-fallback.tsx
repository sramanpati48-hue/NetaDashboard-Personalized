"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type Ref,
} from "react";
import { PREVIEW_ASPECT, projectToPreview } from "@/lib/map-config";
import type { BoundaryPolygon, DensityPoint, MapAreaLabel, MapMarker as MapMarkerData } from "@/lib/types";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { MapMarker } from "./map-marker";
import type { MapViewportApi } from "./use-command-map-state";

export interface MapEngineProps {
  markers: readonly MapMarkerData[];
  labels: readonly MapAreaLabel[];
  boundary: BoundaryPolygon;
  density: readonly DensityPoint[];
  showHeat: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Wheel zooms without a modifier key (full-page map). */
  freeWheelZoom: boolean;
  /** Allow one-finger panning to take over vertical touch scrolling. */
  captureTouch: boolean;
  apiRef: Ref<MapViewportApi>;
}

interface View {
  zoom: number;
  tx: number;
  ty: number;
}

interface Size {
  width: number;
  height: number;
}

const ZOOM_STEP = 1.45;
const ARTBOARD = { width: 1600, height: 1000 };

function useElementSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<Size | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((current) =>
        current && current.width === width && current.height === height ? current : { width, height },
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

function worldSize(size: Size) {
  const width = Math.max(size.width, size.height * PREVIEW_ASPECT);
  return { width, height: width / PREVIEW_ASPECT };
}

/** Local constituency preview used when map tiles are not configured or fail to load. */
export function MapFallback({
  markers,
  labels,
  boundary,
  density,
  showHeat,
  selectedId,
  onSelect,
  freeWheelZoom,
  captureTouch,
  apiRef,
}: MapEngineProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const size = useElementSize(viewportRef);
  const reduceMotion = usePrefersReducedMotion();
  const [userView, setUserView] = useState<View | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number; view: View; moved: boolean } | null>(null);

  const ring = boundary.coordinates[0];
  const boundaryPoints = useMemo(
    () => ring.map(([longitude, latitude]) => projectToPreview(longitude, latitude)),
    [ring],
  );

  const limits = useMemo(() => {
    if (!size) return null;
    const world = worldSize(size);
    const xs = boundaryPoints.map((point) => point.x);
    const ys = boundaryPoints.map((point) => point.y);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const fitZoom = Math.max(
      1,
      Math.min(
        (size.width * 0.86) / (((maxX - minX) / 100) * world.width),
        (size.height * 0.8) / (((maxY - minY) / 100) * world.height),
      ),
    );
    const centre = {
      x: (((minX + maxX) / 2 - 50) / 100) * world.width,
      y: (((minY + maxY) / 2 - 50) / 100) * world.height,
    };
    return {
      size,
      world,
      fit: { zoom: fitZoom, tx: -centre.x * fitZoom, ty: -centre.y * fitZoom } satisfies View,
      minZoom: 1,
      maxZoom: fitZoom * 4,
    };
  }, [size, boundaryPoints]);

  const clampView = useCallback(
    (view: View): View => {
      if (!limits) return view;
      const zoom = Math.min(limits.maxZoom, Math.max(limits.minZoom, view.zoom));
      const maxX = Math.max(0, (zoom * limits.world.width - limits.size.width) / 2);
      const maxY = Math.max(0, (zoom * limits.world.height - limits.size.height) / 2);
      return {
        zoom,
        tx: Math.min(maxX, Math.max(-maxX, view.tx)),
        ty: Math.min(maxY, Math.max(-maxY, view.ty)),
      };
    },
    [limits],
  );

  const fitView = useMemo<View>(() => limits?.fit ?? { zoom: 1, tx: 0, ty: 0 }, [limits]);
  const view = userView ? clampView(userView) : clampView(fitView);

  const zoomBy = useCallback(
    (factor: number) => {
      setUserView((previous) => {
        const current = clampView(previous ?? fitView);
        const zoom = Math.min(limits?.maxZoom ?? 4, Math.max(limits?.minZoom ?? 1, current.zoom * factor));
        const ratio = zoom / current.zoom;
        return clampView({ zoom, tx: current.tx * ratio, ty: current.ty * ratio });
      });
    },
    [clampView, fitView, limits],
  );

  const panBy = useCallback(
    (dx: number, dy: number) => {
      setUserView((previous) => {
        const current = clampView(previous ?? fitView);
        return clampView({ ...current, tx: current.tx + dx, ty: current.ty + dy });
      });
    },
    [clampView, fitView],
  );

  useImperativeHandle(
    apiRef,
    () => ({
      zoomIn: () => zoomBy(ZOOM_STEP),
      zoomOut: () => zoomBy(1 / ZOOM_STEP),
      recenter: () => setUserView(null),
      focus: (marker) => {
        if (!limits) return;
        const point = projectToPreview(marker.longitude, marker.latitude);
        setUserView((previous) => {
          const zoom = Math.max(clampView(previous ?? fitView).zoom, limits.fit.zoom * 1.3);
          return clampView({
            zoom,
            tx: -((point.x - 50) / 100) * limits.world.width * zoom,
            ty: -((point.y - 50) / 100) * limits.world.height * zoom,
          });
        });
      },
    }),
    [zoomBy, limits, clampView, fitView],
  );

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    function handleWheel(event: WheelEvent) {
      if (!freeWheelZoom && !event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? 1.18 : 1 / 1.18);
    }
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [freeWheelZoom, zoomBy]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragRef.current = { x: event.clientX, y: event.clientY, view, moved: false };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    setUserView(clampView({ ...drag.view, tx: drag.view.tx + dx, ty: drag.view.ty + dy }));
  }

  function handlePointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (drag && !drag.moved) onSelect(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const step = 64;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => panBy(step, 0),
      ArrowRight: () => panBy(-step, 0),
      ArrowUp: () => panBy(0, step),
      ArrowDown: () => panBy(0, -step),
      "+": () => zoomBy(ZOOM_STEP),
      "=": () => zoomBy(ZOOM_STEP),
      "-": () => zoomBy(1 / ZOOM_STEP),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  const animate = !dragging && !reduceMotion;
  const counterScale = `scale(${1 / view.zoom})`;
  const transition = animate ? "transform 220ms ease-out" : "none";
  const orderedMarkers = useMemo(
    () => [...markers].sort((a, b) => b.latitude - a.latitude),
    [markers],
  );
  const boundaryPath = boundaryPoints
    .map((point, index) => `${index === 0 ? "M" : "L"}${(point.x * ARTBOARD.width) / 100} ${(point.y * ARTBOARD.height) / 100}`)
    .join(" ");

  return (
    <div
      ref={viewportRef}
      tabIndex={0}
      role="region"
      aria-roledescription="map"
      aria-label="North East Delhi constituency map preview. Use arrow keys to pan and plus or minus to zoom."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={() => zoomBy(ZOOM_STEP)}
      onKeyDown={handleKeyDown}
      className={cn(
        "absolute inset-0 overflow-hidden bg-[#1e293b] select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-info",
        dragging ? "cursor-grabbing" : "cursor-grab",
        captureTouch ? "touch-none" : "touch-pan-y",
      )}
    >
      <div
        className="relative"
        style={{
          width: limits?.world.width ?? "100%",
          height: limits?.world.height ?? "100%",
          transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.zoom})`,
          transformOrigin: "center center",
          transition,
        }}
      >
        <img
          src="/images/map/delhi_satellite_map_hq.png"
          alt="North East Delhi Constituency Command Map Satellite View"
          className="size-full object-cover select-none pointer-events-none"
        />

        {/* Boundary SVG overlay */}
        <svg
          viewBox={`0 0 ${ARTBOARD.width} ${ARTBOARD.height}`}
          className="pointer-events-none absolute inset-0 size-full"
        >
          <path
            d={boundaryPath}
            fill="#312e81"
            fillOpacity={0.08}
            stroke="#4f46e5"
            strokeWidth={14}
            strokeOpacity={0.7}
          />
          <path
            d={boundaryPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth={4}
            strokeDasharray="12 8"
          />
          {showHeat ? <HeatLayer density={density} /> : null}
        </svg>

        {/* Locality and constituency labels */}
        {labels.map((label) => {
          const point = projectToPreview(label.longitude, label.latitude);
          return (
            <div
              key={label.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: `${counterScale} translate(-50%, -50%)`,
              }}
            >
              <AreaLabelText label={label} />
            </div>
          );
        })}

        {/* Interactive marker pins */}
        {orderedMarkers.map((marker) => {
          const point = projectToPreview(marker.longitude, marker.latitude);
          return (
            <div
              key={marker.id}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: `${counterScale} translate(-50%, -100%)`,
                zIndex: marker.id === selectedId ? 10 : 2,
              }}
            >
              <MapMarker
                marker={marker}
                selected={marker.id === selectedId}
                onSelect={onSelect}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AreaLabelText({ label }: { label: MapAreaLabel }) {
  if (label.kind === "constituency") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/50 bg-[#0f172a]/90 px-3 py-1 text-[0.6875rem] font-bold tracking-[0.14em] text-white uppercase shadow-lg backdrop-blur-md">
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        {label.name.toUpperCase()} CONSTITUENCY
      </span>
    );
  }
  return (
    <span
      className={cn(
        "block whitespace-nowrap rounded px-1.5 py-0.5 font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]",
        label.kind === "locality" && "bg-black/40 text-[0.75rem] tracking-wide backdrop-blur-xs",
        label.kind === "neighbour" && "text-[0.6875rem] tracking-[0.1em] text-white/75 uppercase",
      )}
    >
      {label.name}
    </span>
  );
}

function HeatLayer({ density }: { density: readonly DensityPoint[] }) {
  return (
    <g style={{ mixBlendMode: "multiply" }}>
      <defs>
        <radialGradient id="hn-heat">
          <stop offset="0%" stopColor="#dc2626" stopOpacity={0.6} />
          <stop offset="40%" stopColor="#ff7a18" stopOpacity={0.38} />
          <stop offset="100%" stopColor="#ffc478" stopOpacity={0} />
        </radialGradient>
      </defs>
      {density.map((point) => {
        const { x, y } = projectToPreview(point.longitude, point.latitude);
        return (
          <circle
            key={`${point.latitude}-${point.longitude}`}
            cx={(x * ARTBOARD.width) / 100}
            cy={(y * ARTBOARD.height) / 100}
            r={22 + 30 * point.weight}
            fill="url(#hn-heat)"
            opacity={0.45 + 0.55 * point.weight}
          />
        );
      })}
    </g>
  );
}

function PreviewBasemap() {
  return (
    <g>
      <rect width="1600" height="1000" fill="#2d3748" />
      <image
        href="/images/map/delhi_satellite_map_hq.png"
        width="1600"
        height="1000"
        preserveAspectRatio="none"
        opacity="0.95"
      />
    </g>
  );
}

import {
  Building2,
  CalendarDays,
  CircleAlert,
  Construction,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { MapLayerId } from "@/lib/types";

export interface MapLayerConfig {
  id: MapLayerId;
  label: string;
  /** Singular label shown on popups and list rows. */
  entityLabel: string;
  icon: LucideIcon;
  /** Hex for map paint and inline styles; SVG/WebGL cannot read CSS variables. */
  color: string;
  /** Tailwind classes for the tinted icon tile. */
  tileClass: string;
  moduleHref: `/dashboard${string}`;
  moduleLabel: string;
}

export const MAP_LAYERS: readonly MapLayerConfig[] = [
  {
    id: "complaints",
    label: "Complaints",
    entityLabel: "Complaint",
    icon: CircleAlert,
    color: "#ef4444",
    tileClass: "bg-danger/10 text-danger",
    moduleHref: "/dashboard/complaints",
    moduleLabel: "Open Complaints",
  },
  {
    id: "development-works",
    label: "Development Works",
    entityLabel: "Development work",
    icon: Construction,
    color: "#ff7a18",
    tileClass: "bg-saffron/12 text-saffron",
    moduleHref: "/dashboard/works",
    moduleLabel: "Open Works Tracker",
  },
  {
    id: "public-assets",
    label: "Public Assets",
    entityLabel: "Public asset",
    icon: Building2,
    color: "#2563eb",
    tileClass: "bg-info/10 text-info",
    moduleHref: "/dashboard/constituency",
    moduleLabel: "Open Constituency Overview",
  },
  {
    id: "events",
    label: "Events & Visits",
    entityLabel: "Event",
    icon: CalendarDays,
    color: "#8b5cf6",
    tileClass: "bg-plum/12 text-plum",
    moduleHref: "/dashboard/events",
    moduleLabel: "Open Events & Visits",
  },
  {
    id: "booths",
    label: "Booth Locations",
    entityLabel: "Polling booth",
    icon: UsersRound,
    color: "#22b573",
    tileClass: "bg-success/12 text-success",
    moduleHref: "/dashboard/outreach",
    moduleLabel: "Open People & Outreach",
  },
];

export const MAP_LAYER_BY_ID = Object.fromEntries(
  MAP_LAYERS.map((layer) => [layer.id, layer]),
) as Record<MapLayerId, MapLayerConfig>;

import type { StyleSpecification } from "maplibre-gl";

/*
 * Default high-resolution satellite basemap with place labels, using
 * Esri ArcGIS World Imagery and Reference Boundaries. Free, public, CORS-enabled.
 */
export const DEFAULT_SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "satellite-tiles": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "© Esri, Maxar, Earthstar Geographics",
      maxzoom: 19,
    },
    "reference-tiles": {
      type: "raster",
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "satellite-layer",
      type: "raster",
      source: "satellite-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
    {
      id: "reference-layer",
      type: "raster",
      source: "reference-tiles",
      minzoom: 0,
      maxzoom: 19,
      paint: {
        "raster-opacity": 0.55,
      },
    },
  ],
};

/*
 * MapLibre style: defaults to the real satellite basemap above.
 * When NEXT_PUBLIC_MAP_STYLE_URL is provided, that URL is used instead.
 */
export const MAP_STYLE_URL = process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim() || null;
export const MAP_STYLE: string | StyleSpecification =
  MAP_STYLE_URL || DEFAULT_SATELLITE_STYLE;

/* Geographic window shared by the MapLibre view and the local preview. */
export const MAP_VIEW = {
  center: { latitude: 28.709, longitude: 77.2885 },
  /** [west, south, east, north] padding the constituency boundary. */
  fitBounds: [77.238, 28.662, 77.338, 28.76] as [number, number, number, number],
  minZoom: 10,
  maxZoom: 18,
};

/*
 * Local preview projection. The window is chosen so that its aspect ratio
 * (longitude span × cos(latitude) ÷ latitude span) is 1.6, matching the
 * preview's 1600 × 1000 artboard, so the equirectangular projection keeps
 * true proportions.
 */
export const PREVIEW_BOUNDS = { west: 77.0885, east: 77.4885, south: 28.599, north: 28.819 };
export const PREVIEW_ASPECT = 1.6;

export function projectToPreview(longitude: number, latitude: number) {
  const { west, east, south, north } = PREVIEW_BOUNDS;
  return {
    x: ((longitude - west) / (east - west)) * 100,
    y: ((north - latitude) / (north - south)) * 100,
  };
}

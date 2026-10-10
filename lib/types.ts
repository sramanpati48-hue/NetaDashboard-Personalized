import type { LucideIcon } from "lucide-react";

export type ModuleId =
  | "home"
  | "constituency"
  | "works"
  | "intelligence"
  | "complaints"
  | "outreach"
  | "events"
  | "letters"
  | "media"
  | "reports"
  | "settings";

export type NavBadge =
  | { kind: "count"; value: number; label: string }
  | { kind: "tag"; value: string };

export interface Constituency {
  id: string;
  name: string;
  region: string;
  house: "Lok Sabha";
}

export interface DateRange {
  from: number;
  to: number;
}

export interface DateRangePreset extends DateRange {
  id: string;
  label: string;
  description: string;
}

export interface NetaProfile {
  name: string;
  salutation: string;
  initials: string;
  role: string;
  house: string;
  homeConstituencyId: string;
}

export type NotificationKind = "intel" | "complaint" | "work";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  timeAgo: string;
  href: `/dashboard${string}`;
  unread: boolean;
}

export type SearchResultKind = "project" | "complaint" | "event";

export interface SearchResult {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  href: `/dashboard${string}`;
  keywords: readonly string[];
}

export interface PhotoAsset {
  /** Local path under /public, or null when the real photo has not been supplied yet. */
  src: string | null;
  alt: string;
  objectPosition?: string;
}

export type MetricTone = "danger" | "success" | "saffron" | "plum";

export interface DashboardMetric {
  id: "complaints" | "works" | "events" | "sanctioned";
  label: string;
  /** null when the source system has not reported a value for the period. */
  value: number | null;
  decimals: number;
  unit?: string;
  trendPercent: number;
  trendDirection: "up" | "down";
  comparisonLabel: string;
  description: string;
  icon: LucideIcon;
  tone: MetricTone;
  sparklineTone: MetricTone;
  sparkline: readonly number[];
  href: `/dashboard${string}`;
}

export interface WeatherSnapshot {
  dateLabel: string;
  location: string;
  temperatureC: number;
  condition: string;
}

export interface GreetingSnapshot {
  greeting: string;
  subtitle: string;
  weather: WeatherSnapshot;
}

export type KeyInsightTone = "danger" | "warning" | "success" | "info";

export interface KeyInsight {
  id: string;
  tone: KeyInsightTone;
  icon: LucideIcon;
  title: string;
  detail: string;
  href: `/dashboard${string}`;
  actionLabel: string;
}

export type MapLayerId =
  | "complaints"
  | "development-works"
  | "public-assets"
  | "events"
  | "booths";

export type MapMode = "map" | "list" | "heatmap";

export type MapEntityType =
  | "complaint"
  | "development-work"
  | "public-asset"
  | "event"
  | "booth";

export interface MapMarker {
  id: string;
  type: MapEntityType;
  layerId: MapLayerId;
  title: string;
  subtitle: string;
  latitude: number;
  longitude: number;
  status?: string;
  progress?: number;
  image?: string;
  ward?: string;
  /** Links a development-work marker to its DevelopmentProject record. */
  projectId?: string;
  metadata?: Record<string, string | number>;
}

export interface MapAreaLabel {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  kind: "constituency" | "locality" | "neighbour";
}

export interface DensityPoint {
  latitude: number;
  longitude: number;
  /** Relative complaint weight, 0–1. */
  weight: number;
}

/** GeoJSON Polygon geometry; coordinates are [longitude, latitude]. */
export interface BoundaryPolygon {
  type: "Polygon";
  coordinates: [number, number][][];
}

export type ProjectStatus = "Planned" | "In Progress" | "Delayed" | "Completed";

export interface ProjectStage {
  id: string;
  label: string;
  date: string;
  state: "done" | "current" | "upcoming";
}

export interface DevelopmentProject {
  id: string;
  title: string;
  ward: string;
  area: string;
  status: ProjectStatus;
  progress: number;
  amountCr: number;
  agency: string;
  scheme: string;
  expectedCompletion: string;
  summary: string;
  image?: string;
  beforeImage?: string;
  afterImage?: string;
  stages: readonly ProjectStage[];
}

export interface NavItem {
  id: ModuleId;
  label: string;
  href: `/dashboard${string}`;
  icon: LucideIcon;
  group: "primary" | "secondary";
  description: string;
  highlights: readonly string[];
  badge?: NavBadge;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
  tone: "success" | "plum" | "info" | "saffron";
  kind: "site-visit" | "public-meeting" | "review-meeting" | "community";
}

export interface IntelligenceFeedItem {
  id: string;
  title: string;
  timeAgo: string;
  thumbnail: string;
  hashtags: readonly string[];
  duration: string;
  transcriptLines: readonly { time: string; text: string }[];
  keyClaims: readonly { claim: string; fact: string; status: "debunked" | "verified" | "misleading" }[];
  aiAnalysis: string;
  evidenceCount: number;
}


"use client";

import { ArrowRight, MapPin, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode, Ref } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MAP_LAYER_BY_ID } from "@/lib/map-config";
import { DEVELOPMENT_PROJECTS } from "@/lib/mock-data";
import type { DevelopmentProject, MapMarker } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectImage } from "./project-image";
import { StatusBadge } from "./status-badge";

export function formatCrore(amountCr: number) {
  return `₹ ${amountCr.toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr`;
}

export function findProject(marker: MapMarker): DevelopmentProject | undefined {
  return marker.projectId
    ? DEVELOPMENT_PROJECTS.find((project) => project.id === marker.projectId)
    : undefined;
}

export const PROGRESS_TONE: Record<DevelopmentProject["status"], string> = {
  Planned: "[&>[data-slot=progress-indicator]]:bg-info",
  "In Progress": "[&>[data-slot=progress-indicator]]:bg-saffron",
  Delayed: "[&>[data-slot=progress-indicator]]:bg-danger",
  Completed: "[&>[data-slot=progress-indicator]]:bg-success",
};

interface SelectionPopupProps {
  marker: MapMarker;
  onClose?: () => void;
  onViewProject: (projectId: string) => void;
  /** Card chrome for the floating map popup; omit inside sheets and panels. */
  floating?: boolean;
  className?: string;
}

/** Routes a selected marker to the project popup or the generic entity popup. */
export function MapSelectionPopup({
  ref,
  marker,
  onClose,
  onViewProject,
  floating = true,
  className,
}: SelectionPopupProps & { ref?: Ref<HTMLDivElement> }) {
  const project = findProject(marker);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="region"
      aria-label={`${marker.title} details`}
      className={cn(
        "relative outline-none",
        !floating && "overflow-hidden rounded-card border border-line bg-white shadow-raised",
        className,
      )}
    >
      {project ? (
        <ProjectMapPopup
          marker={marker}
          project={project}
          onClose={onClose}
          onViewProject={() => onViewProject(project.id)}
          floating={floating}
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-raised">
          <MarkerInfoPopup marker={marker} onClose={onClose} />
        </div>
      )}
    </div>
  );
}

interface ProjectMapPopupProps {
  marker: MapMarker;
  project: DevelopmentProject;
  onClose?: () => void;
  onViewProject: () => void;
  floating?: boolean;
}

export function ProjectMapPopup({
  marker,
  project,
  onClose,
  onViewProject,
  floating = false,
}: ProjectMapPopupProps) {
  if (floating) {
    return (
      <div className="relative group flex items-center gap-3 rounded-2xl border border-line/90 bg-white/98 p-2.5 pr-3 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl">
        {/* Pointer arrow pointing to pin */}
        <div
          aria-hidden="true"
          className="absolute -left-2 top-1/2 -translate-y-1/2 size-0 border-y-[6px] border-r-[8px] border-y-transparent border-r-white drop-shadow-[-2px_0_1px_rgba(0,0,0,0.08)]"
        />

        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-line/80 shadow-xs">
          <ProjectImage
            src={project.image ?? marker.image}
            alt={project.title}
            sizes="120px"
            className="size-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h3 className="truncate text-xs sm:text-sm font-bold text-navy leading-tight">{project.title}</h3>
            {onClose ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-ink-muted hover:text-navy p-0.5 rounded transition-colors"
                aria-label="Close popup"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
          <p className="truncate text-[11px] text-ink-muted mt-0.5">
            {project.ward}, {project.area}
          </p>

          <div className="mt-1.5 flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-500/20">
              <span className="size-1.5 rounded-full bg-amber-500" />
              {project.status}
            </span>
            <div className="flex items-center gap-1.5 flex-1 max-w-[5.5rem]">
              <Progress
                value={project.progress}
                aria-label={`${project.title} progress`}
                className="h-1.5 bg-line [&>[data-slot=progress-indicator]]:bg-saffron"
              />
              <span className="text-[10px] font-bold text-navy tabular-nums">{project.progress}%</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewProject}
          aria-label={`View details for ${project.title}`}
          className="hn-focus-ring flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-canvas text-navy shadow-xs transition-all hover:bg-navy hover:text-white hover:scale-105 active:scale-95"
          title="View Project Details"
        >
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <ProjectImage
          src={project.image ?? marker.image}
          alt={project.title}
          sizes="320px"
          className="h-28"
        />
        {onClose ? <CloseButton onClick={onClose} onImage /> : null}
      </div>
      <div className="flex flex-col gap-3 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-navy">{project.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
              <MapPin aria-hidden="true" className="size-3 shrink-0 text-saffron" />
              {project.ward}, {project.area}
            </p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-ink-muted">Progress</span>
            <span className="font-semibold text-navy tabular-nums">{project.progress}%</span>
          </div>
          <Progress
            value={project.progress}
            aria-label={`${project.title} progress`}
            className={cn("mt-1.5 h-1.5 bg-line", PROGRESS_TONE[project.status])}
          />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
          <div>
            <p className="text-[0.6875rem] text-ink-muted">Sanctioned amount</p>
            <p className="text-sm font-bold text-navy tabular-nums">{formatCrore(project.amountCr)}</p>
          </div>
          <Button
            size="sm"
            onClick={onViewProject}
            className="h-9 gap-1.5 rounded-control bg-navy px-3 text-xs font-semibold hover:bg-navy/90"
          >
            View Project
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MarkerInfoPopup({ marker, onClose }: { marker: MapMarker; onClose?: () => void }) {
  const layer = MAP_LAYER_BY_ID[marker.layerId];
  const Icon = layer.icon;
  const metadata = Object.entries(marker.metadata ?? {});

  return (
    <div className="flex flex-col gap-3 p-3.5">
      <div className="flex items-start gap-2.5 pr-8">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-control",
            layer.tileClass,
          )}
        >
          <Icon aria-hidden="true" className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="hn-eyebrow">{layer.entityLabel}</p>
          <h3 className="mt-0.5 text-sm font-semibold text-navy">{marker.title}</h3>
          <p className="mt-0.5 text-xs text-ink-muted">{marker.subtitle}</p>
        </div>
      </div>
      {onClose ? <CloseButton onClick={onClose} /> : null}

      {marker.status || marker.ward ? (
        <div className="flex flex-wrap items-center gap-2">
          {marker.status ? <StatusBadge status={marker.status} /> : null}
          {marker.ward ? (
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <MapPin aria-hidden="true" className="size-3 text-saffron" />
              {marker.ward}
            </span>
          ) : null}
        </div>
      ) : null}

      {metadata.length > 0 ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-control bg-canvas px-3 py-2.5 text-xs">
          {metadata.map(([key, value]) => (
            <Row key={key} label={key}>
              {typeof value === "number" ? value.toLocaleString("en-IN") : value}
            </Row>
          ))}
        </dl>
      ) : null}

      <Link
        href={layer.moduleHref}
        className="hn-focus-ring inline-flex min-h-9 items-center gap-1.5 self-start rounded-sm text-xs font-semibold text-info hover:underline"
      >
        {layer.moduleLabel}
        <ArrowRight aria-hidden="true" className="size-3.5" />
      </Link>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-navy">{children}</dd>
    </>
  );
}

function CloseButton({ onClick, onImage }: { onClick: () => void; onImage?: boolean }) {
  return (
    <button
      type="button"
      aria-label="Close details"
      onClick={onClick}
      className={cn(
        "hn-focus-ring absolute top-2 right-2 flex size-8 items-center justify-center rounded-full transition-colors",
        onImage
          ? "bg-white/90 text-navy shadow-sm hover:bg-white"
          : "text-ink-muted hover:bg-canvas hover:text-navy",
      )}
    >
      <X aria-hidden="true" className="size-4" />
    </button>
  );
}

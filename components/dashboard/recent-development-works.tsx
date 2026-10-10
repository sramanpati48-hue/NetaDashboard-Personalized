"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProjectDetailsSheet } from "@/components/map/project-details-sheet";
import { StatusBadge } from "@/components/map/status-badge";
import { Progress } from "@/components/ui/progress";
import { DEVELOPMENT_PROJECTS } from "@/lib/mock-data";
import type { DevelopmentProject } from "@/lib/types";
import { cn } from "@/lib/utils";

const PROGRESS_COLOR: Record<DevelopmentProject["status"], string> = {
  Planned: "[&>[data-slot=progress-indicator]]:bg-info",
  "In Progress": "[&>[data-slot=progress-indicator]]:bg-saffron",
  Delayed: "[&>[data-slot=progress-indicator]]:bg-danger",
  Completed: "[&>[data-slot=progress-indicator]]:bg-success",
};

export function RecentDevelopmentWorks() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  return (
    <section aria-labelledby="recent-works-heading" className="hn-card p-4 sm:p-4.5">
      <header className="flex items-center justify-between border-b border-line pb-2.5">
        <h2 id="recent-works-heading" className="text-sm font-bold text-navy">
          Recent Development Works
        </h2>
        <Link
          href="/dashboard/works"
          className="hn-focus-ring group flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View All
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </header>

      <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DEVELOPMENT_PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProjectId(project.id)}
          />
        ))}
      </div>

      <ProjectDetailsSheet
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />
    </section>
  );
}

interface ProjectCardProps {
  project: DevelopmentProject;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const isDelayed = project.status === "Delayed";
  const isCompleted = project.status === "Completed";

  const progressBg = isDelayed
    ? "bg-danger"
    : isCompleted
      ? "bg-success"
      : "bg-saffron";

  const completionLabel = isDelayed
    ? "18 days delayed"
    : isCompleted
      ? "Completed Jan 2025"
      : "Due Dec 2025";

  return (
    <article
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-card border border-line bg-surface transition-all duration-200 hover:border-navy/30 hover:shadow-raised"
    >
      {/* Real Project Photograph with circular chevron icon button */}
      <div className="relative h-24 sm:h-26 w-full overflow-hidden bg-muted">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 250px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted text-ink-muted">
            No photograph
          </div>
        )}

        {/* White circular arrow button matching reference screenshot */}
        <span
          aria-hidden="true"
          className="absolute right-2 bottom-2 z-10 flex size-6 items-center justify-center rounded-full bg-white text-navy shadow-sm transition-transform group-hover:translate-x-0.5"
        >
          <ChevronRight className="size-3.5 stroke-[2.5]" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <h3 className="text-[11.5px] sm:text-[12px] font-bold text-navy leading-tight transition-colors group-hover:text-indigo-600">
          {project.title}
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {project.ward}, {project.area}
        </p>

        {/* Status Pill Badge */}
        <div className="mt-2 flex items-center">
          <StatusBadge status={project.status} />
        </div>

        {/* Progress bar with percentage aligned on right */}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-line overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", progressBg)}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-navy tabular-nums shrink-0">
            {project.progress}%
          </span>
        </div>

        {/* Card Footer: Amount & Expected/Completed date or delay */}
        <div className="mt-2.5 flex flex-col">
          <p className="text-xs sm:text-[13px] font-bold text-navy tabular-nums">
            ₹ {project.amountCr} Cr
          </p>
          <p
            className={cn(
              "text-[11px]",
              isDelayed ? "font-semibold text-danger" : "text-slate-500",
            )}
          >
            {completionLabel}
          </p>
        </div>
      </div>
    </article>
  );
}

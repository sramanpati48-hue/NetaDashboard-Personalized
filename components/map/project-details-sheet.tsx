"use client";

import { useState } from "react";
import { ArrowRight, Check, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DEVELOPMENT_PROJECTS } from "@/lib/mock-data";
import type { ProjectStage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatCrore, PROGRESS_TONE } from "./project-map-popup";
import { ProjectImage } from "./project-image";
import { StatusBadge } from "./status-badge";

interface ProjectDetailsSheetProps {
  projectId: string | null;
  onClose: () => void;
}

export function ProjectDetailsSheet({ projectId, onClose }: ProjectDetailsSheetProps) {
  const project = DEVELOPMENT_PROJECTS.find((item) => item.id === projectId);
  const [viewMode, setViewMode] = useState<"after" | "before">("after");

  const currentImage =
    viewMode === "before"
      ? (project?.beforeImage ?? project?.image)
      : (project?.afterImage ?? project?.image);

  return (
    <Sheet open={Boolean(project)} onOpenChange={(open) => (open ? undefined : onClose())}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {project ? (
          <>
            <div className="relative">
              <ProjectImage
                src={currentImage}
                alt={project.title}
                sizes="448px"
                className="h-44 shrink-0 transition-opacity duration-300"
              />
              {project.beforeImage && project.afterImage ? (
                <div className="absolute bottom-2 left-2 z-10 flex rounded-full bg-black/60 p-0.5 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setViewMode("before")}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors",
                      viewMode === "before"
                        ? "bg-white text-navy font-bold shadow-xs"
                        : "text-white/80 hover:text-white",
                    )}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("after")}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors",
                      viewMode === "after"
                        ? "bg-white text-navy font-bold shadow-xs"
                        : "text-white/80 hover:text-white",
                    )}
                  >
                    Current / After
                  </button>
                </div>
              ) : null}
            </div>
            <SheetHeader className="gap-2 border-b border-line">
              <div className="flex items-start justify-between gap-3 pr-6">
                <SheetTitle className="text-lg text-navy">{project.title}</SheetTitle>
                <StatusBadge status={project.status} className="mt-0.5" />
              </div>
              <SheetDescription className="flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-3.5 text-saffron" />
                {project.ward}, {project.area}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 p-4">
              <div className="rounded-card border border-line p-3.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium text-ink-muted">Overall progress</span>
                  <span className="text-lg font-bold text-navy tabular-nums">{project.progress}%</span>
                </div>
                <Progress
                  value={project.progress}
                  aria-label={`${project.title} progress`}
                  className={cn("mt-2 h-2 bg-line", PROGRESS_TONE[project.status])}
                />
              </div>

              <dl className="grid grid-cols-2 gap-3">
                <Fact label="Sanctioned amount" value={formatCrore(project.amountCr)} strong />
                <Fact label="Ward" value={`${project.ward}, ${project.area}`} />
                <Fact label="Executing agency" value={project.agency} />
                <Fact label="Scheme" value={project.scheme} />
                <Fact label="Completion" value={project.expectedCompletion} wide />
              </dl>

              <section aria-labelledby="project-summary">
                <h3 id="project-summary" className="hn-eyebrow">
                  Stage summary
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink">{project.summary}</p>
                <ol className="mt-3 flex flex-col">
                  {project.stages.map((stage, index) => (
                    <StageRow key={stage.id} stage={stage} last={index === project.stages.length - 1} />
                  ))}
                </ol>
              </section>
            </div>

            <div className="mt-auto border-t border-line p-4">
              <Button asChild className="h-10 w-full gap-2 rounded-control bg-navy hover:bg-navy/90">
                <Link href="/dashboard/works" onNavigate={onClose}>
                  Open Works Tracker
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Fact({
  label,
  value,
  strong,
  wide,
}: {
  label: string;
  value: string;
  strong?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={cn("rounded-control bg-canvas px-3 py-2.5", wide && "col-span-2")}>
      <dt className="text-[0.6875rem] text-ink-muted">{label}</dt>
      <dd className={cn("mt-0.5 text-[0.8125rem] text-navy", strong ? "font-bold" : "font-medium")}>
        {value}
      </dd>
    </div>
  );
}

function StageRow({ stage, last }: { stage: ProjectStage; last: boolean }) {
  return (
    <li className="relative flex gap-3 pb-3 last:pb-0">
      {!last ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-6 bottom-0 left-[0.6875rem] w-px",
            stage.state === "done" ? "bg-success/50" : "bg-line",
          )}
        />
      ) : null}
      <span
        className={cn(
          "relative flex size-6 shrink-0 items-center justify-center rounded-full border-2",
          stage.state === "done" && "border-success bg-success text-white",
          stage.state === "current" && "border-saffron bg-white",
          stage.state === "upcoming" && "border-line bg-white",
        )}
      >
        {stage.state === "done" ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : null}
        {stage.state === "current" ? <span className="size-2 rounded-full bg-saffron" /> : null}
      </span>
      <div className="min-w-0 pt-0.5">
        <p
          className={cn(
            "text-[0.8125rem] font-medium",
            stage.state === "upcoming" ? "text-ink-muted" : "text-navy",
          )}
        >
          {stage.label}
          <span className="sr-only">
            {stage.state === "done" ? " (completed)" : stage.state === "current" ? " (current stage)" : " (upcoming)"}
          </span>
        </p>
        <p className="text-xs text-ink-muted">{stage.date}</p>
      </div>
    </li>
  );
}

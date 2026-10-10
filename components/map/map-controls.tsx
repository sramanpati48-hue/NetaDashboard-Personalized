"use client";

import { LocateFixed, Maximize2, Minimize2, Minus, Plus, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onToggleExpanded: () => void;
  expanded: boolean;
  className?: string;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onRecenter,
  onToggleExpanded,
  expanded,
  className,
}: MapControlsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col overflow-hidden rounded-control border border-line bg-white shadow-raised">
        <ControlButton icon={Plus} label="Zoom in" onClick={onZoomIn} />
        <span aria-hidden="true" className="h-px bg-line" />
        <ControlButton icon={Minus} label="Zoom out" onClick={onZoomOut} />
      </div>
      <div className="flex flex-col overflow-hidden rounded-control border border-line bg-white shadow-raised">
        <ControlButton icon={LocateFixed} label="Recenter on constituency" onClick={onRecenter} />
      </div>
      <div className="flex flex-col overflow-hidden rounded-control border border-line bg-white shadow-raised">
        <ControlButton
          icon={expanded ? Minimize2 : Maximize2}
          label={expanded ? "Exit full screen" : "Full screen"}
          onClick={onToggleExpanded}
          pressed={expanded}
        />
      </div>
    </div>
  );
}

interface ControlButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  pressed?: boolean;
}

function ControlButton({ icon: Icon, label, onClick, pressed }: ControlButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={pressed}
          onClick={onClick}
          className="hn-focus-ring flex size-11 items-center justify-center text-navy transition-colors hover:bg-canvas active:bg-line/60 lg:size-9"
        >
          <Icon aria-hidden="true" className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}

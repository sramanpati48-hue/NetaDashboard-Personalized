"use client";

import { Flame, List, MapIcon, type LucideIcon } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import type { MapMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const MODES: readonly { id: MapMode; label: string; icon: LucideIcon }[] = [
  { id: "map", label: "Map", icon: MapIcon },
  { id: "list", label: "List", icon: List },
  { id: "heatmap", label: "Heatmap", icon: Flame },
];

interface MapModeSwitcherProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
  className?: string;
}

export function MapModeSwitcher({ mode, onChange, className }: MapModeSwitcherProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = MODES.findIndex((item) => item.id === mode);
    const next = MODES[(index + step + MODES.length) % MODES.length];
    onChange(next.id);
    groupRef.current?.querySelector<HTMLButtonElement>(`[data-mode="${next.id}"]`)?.focus();
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="Map view"
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex rounded-control border border-line bg-white/96 p-0.5 shadow-raised backdrop-blur-sm",
        className,
      )}
    >
      {MODES.map((item) => {
        const Icon = item.icon;
        const active = item.id === mode;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            data-mode={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "hn-focus-ring inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-[0.5rem] px-3 text-[0.8125rem] font-semibold transition-colors max-[479px]:px-2.5 lg:min-h-8",
              active ? "bg-navy text-white shadow-sm" : "text-ink-muted hover:bg-canvas hover:text-navy",
            )}
          >
            <Icon aria-hidden="true" className="size-3.5" />
            <span className="max-[479px]:sr-only">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

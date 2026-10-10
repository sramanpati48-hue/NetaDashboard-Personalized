"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MapSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MapSearchField({ value, onChange, className }: MapSearchFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filter by name, ward or status…"
        aria-label="Filter map entities"
        className="h-11 rounded-control border-line bg-white pr-10 pl-9 text-sm shadow-card lg:h-10 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear filter"
          onClick={() => onChange("")}
          className="hn-focus-ring absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-canvas hover:text-navy"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

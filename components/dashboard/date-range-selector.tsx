"use client";

import { CalendarRange, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatDateRange, useDashboard } from "@/components/dashboard/dashboard-provider";
import { topbarControlClass } from "@/components/dashboard/topbar-control";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DATE_RANGE_PRESETS, SELECTABLE_YEARS } from "@/lib/mock-data";
import type { DateRange } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DateRangeSelector({ className }: { className?: string }) {
  const { dateRange, setDateRange } = useDashboard();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(dateRange);

  const activePreset = DATE_RANGE_PRESETS.find(
    (p) => p.from === dateRange.from && p.to === dateRange.to,
  );

  function handleOpenChange(next: boolean) {
    if (next) setDraft(dateRange);
    setOpen(next);
  }

  function apply(range: DateRange) {
    setDateRange(range);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        aria-label={`Date range: ${formatDateRange(dateRange)}. Change date range`}
        className={cn(topbarControlClass, className)}
      >
        <CalendarRange aria-hidden className="size-4 shrink-0 text-navy/70" />
        <span className="min-w-0 flex-1 text-left tabular-nums">{formatDateRange(dateRange)}</span>
        <ChevronDown aria-hidden className="size-3.5 shrink-0 text-ink-muted" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 gap-0 p-0">
        <div className="p-1.5">
          <p className="px-2 pt-1 pb-1.5 text-xs font-medium text-ink-muted">Reporting period</p>
          {DATE_RANGE_PRESETS.map((preset) => {
            const selected = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => apply({ from: preset.from, to: preset.to })}
                className="hn-focus-ring flex min-h-11 w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-muted"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.8125rem] font-medium tabular-nums text-navy">
                    {preset.label}
                  </span>
                  <span className="block text-[0.6875rem] text-ink-muted">{preset.description}</span>
                </span>
                {selected ? <Check aria-hidden className="size-4 text-navy" /> : null}
              </button>
            );
          })}
        </div>

        <div className="border-t border-line p-3">
          <p className="text-xs font-medium text-ink-muted">Custom range</p>
          <YearRow
            label="From"
            value={draft.from}
            isDisabled={(year) => year > draft.to}
            onSelect={(from) => setDraft((d) => ({ ...d, from }))}
          />
          <YearRow
            label="To"
            value={draft.to}
            isDisabled={(year) => year < draft.from}
            onSelect={(to) => setDraft((d) => ({ ...d, to }))}
          />
          <Button
            type="button"
            className="mt-3 h-10 w-full rounded-control"
            onClick={() => apply(draft)}
          >
            Apply {formatDateRange(draft)}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface YearRowProps {
  label: string;
  value: number;
  isDisabled: (year: number) => boolean;
  onSelect: (year: number) => void;
}

function YearRow({ label, value, isDisabled, onSelect }: YearRowProps) {
  return (
    <div className="mt-2.5" role="radiogroup" aria-label={`${label} year`}>
      <span className="text-[0.6875rem] font-medium text-navy/70">{label}</span>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {SELECTABLE_YEARS.map((year) => {
          const selected = year === value;
          return (
            <button
              key={year}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={String(year)}
              disabled={isDisabled(year)}
              onClick={() => onSelect(year)}
              className={cn(
                "hn-focus-ring h-8 rounded-md text-[0.6875rem] font-medium tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-35",
                selected ? "bg-navy text-white" : "bg-muted text-navy hover:bg-navy/10",
              )}
            >
              {"’" + String(year).slice(2)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

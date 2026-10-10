"use client";

import { CalendarDays, MessageSquareWarning, Search, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SEARCH_RESULTS } from "@/lib/mock-data";
import type { SearchResult, SearchResultKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "Search complaints, projects, people, media, documents...";

const GROUPS: { kind: SearchResultKind; heading: string; icon: typeof Search; tone: string }[] = [
  { kind: "project", heading: "Development works", icon: Workflow, tone: "bg-saffron/12 text-saffron" },
  { kind: "complaint", heading: "Complaints", icon: MessageSquareWarning, tone: "bg-danger/10 text-danger" },
  { kind: "event", heading: "Events & visits", icon: CalendarDays, tone: "bg-ai/10 text-ai" },
];

export function GlobalSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function openResult(result: SearchResult) {
    setOpen(false);
    router.push(result.href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the dashboard"
        aria-keyshortcuts="Control+K Meta+K"
        className={cn(
          "hn-focus-ring hidden h-10 w-full min-w-0 items-center gap-2.5 rounded-control border border-line bg-surface pr-1.5 pl-3 text-left shadow-card transition-colors hover:border-navy/20 md:flex",
          className,
        )}
      >
        <Search aria-hidden className="size-4 shrink-0 text-ink-muted" />
        <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-ink-muted">{PLACEHOLDER}</span>
        <span aria-hidden className="flex shrink-0 items-center gap-1">
          <kbd className="rounded-[5px] border border-line bg-muted px-1.5 py-0.5 font-sans text-[0.6875rem] font-medium text-navy/80">
            Ctrl
          </kbd>
          <kbd className="rounded-[5px] border border-line bg-muted px-1.5 py-0.5 font-sans text-[0.6875rem] font-medium text-navy/80">
            K
          </kbd>
        </span>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the dashboard"
        className="hn-focus-ring inline-flex size-11 items-center justify-center rounded-control text-navy hover:bg-muted md:hidden"
      >
        <Search aria-hidden className="size-5" />
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search HamaraNeta"
        description="Search complaints, development works, events and people."
        className="sm:max-w-xl"
      >
        <Command className="rounded-none! bg-transparent p-1">
          <CommandInput placeholder={PLACEHOLDER} />
          <SearchResultsList onSelect={openResult} />
        </Command>
        <div className="flex items-center justify-between border-t border-line px-3 py-2 text-[0.6875rem] text-ink-muted">
          <span>Demo results · live search connects to the HN data service</span>
          <span className="hidden sm:inline">↑↓ to move · Enter to open</span>
        </div>
      </CommandDialog>
    </>
  );
}

function SearchResultsList({ onSelect }: { onSelect: (result: SearchResult) => void }) {
  return (
    <CommandList className="mt-1 max-h-[min(60vh,22rem)]">
      <CommandEmpty>
        <span className="block text-sm font-medium text-navy">No matches in demo data</span>
        <span className="mt-1 block text-xs text-ink-muted">
          Try “road”, “Gokulpuri”, “health” or “Jan Samvaad”.
        </span>
      </CommandEmpty>
      {GROUPS.map((group) => {
        const results = SEARCH_RESULTS.filter((r) => r.kind === group.kind);
        if (results.length === 0) return null;
        const Icon = group.icon;
        return (
          <CommandGroup key={group.kind} heading={group.heading}>
            {results.map((result) => (
              <CommandItem
                key={result.id}
                value={`${result.title} ${result.subtitle}`}
                keywords={[...result.keywords]}
                onSelect={() => onSelect(result)}
                className="min-h-12 gap-3 py-2"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-[8px]",
                    group.tone,
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8125rem] font-medium text-navy">
                    {result.title}
                  </span>
                  <span className="block truncate text-xs text-ink-muted">{result.subtitle}</span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        );
      })}
    </CommandList>
  );
}

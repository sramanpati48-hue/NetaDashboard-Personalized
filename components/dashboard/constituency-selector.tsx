"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { topbarControlClass } from "@/components/dashboard/topbar-control";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CONSTITUENCIES, NETA_PROFILE } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ConstituencySelector({ className }: { className?: string }) {
  const { constituency, selectConstituency } = useDashboard();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={`Constituency: ${constituency.name}. Change constituency`}
        className={cn(topbarControlClass, "min-w-0", className)}
      >
        <MapPin aria-hidden className="size-4 shrink-0 text-saffron" />
        <span className="min-w-0 flex-1 truncate text-left">{constituency.name}</span>
        <ChevronDown aria-hidden className="size-3.5 shrink-0 text-ink-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1.5">
        <DropdownMenuLabel>Lok Sabha constituency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={constituency.id} onValueChange={selectConstituency}>
          {CONSTITUENCIES.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id} className="min-h-10 py-1.5">
              <span className="flex min-w-0 flex-col">
                <span className="text-[0.8125rem] font-medium text-navy">{option.name}</span>
                <span className="text-[0.6875rem] text-ink-muted">
                  {option.id === NETA_PROFILE.homeConstituencyId ? "Your seat · " : ""}
                  {option.region}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

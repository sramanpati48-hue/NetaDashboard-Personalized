"use client";

import { createContext, use, useMemo, useState } from "react";
import { toast } from "sonner";
import { CONSTITUENCIES, DATE_RANGE_PRESETS, NETA_PROFILE } from "@/lib/mock-data";
import type { Constituency, DateRange } from "@/lib/types";

interface DashboardContextValue {
  constituency: Constituency;
  isHomeConstituency: boolean;
  selectConstituency: (id: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const defaultConstituency =
  CONSTITUENCIES.find((c) => c.id === NETA_PROFILE.homeConstituencyId) ?? CONSTITUENCIES[0];
const defaultRange = DATE_RANGE_PRESETS[0];

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [constituency, setConstituency] = useState<Constituency>(defaultConstituency);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: defaultRange.from,
    to: defaultRange.to,
  });

  const value = useMemo<DashboardContextValue>(
    () => ({
      constituency,
      isHomeConstituency: constituency.id === NETA_PROFILE.homeConstituencyId,
      selectConstituency: (id) => {
        const next = CONSTITUENCIES.find((c) => c.id === id);
        if (!next || next.id === constituency.id) return;
        setConstituency(next);
        toast.success(`Now viewing ${next.name}`, {
          description:
            next.id === NETA_PROFILE.homeConstituencyId
              ? undefined
              : "Demo figures still reflect North East Delhi until live data is connected.",
        });
      },
      dateRange,
      setDateRange,
    }),
    [constituency, dateRange],
  );

  return <DashboardContext value={value}>{children}</DashboardContext>;
}

export function useDashboard(): DashboardContextValue {
  const context = use(DashboardContext);
  if (!context) throw new Error("useDashboard must be used inside <DashboardProvider>");
  return context;
}

export function formatDateRange({ from, to }: DateRange): string {
  return from === to ? String(from) : `${from} – ${to}`;
}

"use client";

import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  FileText,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { TODAYS_SCHEDULE } from "@/lib/mock-data";
import type { ScheduleItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<ScheduleItem["kind"], LucideIcon> = {
  "site-visit": Briefcase,
  "public-meeting": Users,
  "review-meeting": FileText,
  community: CalendarCheck,
};

const TONE_BADGE: Record<ScheduleItem["tone"], { bg: string; text: string; dot: string }> = {
  success: {
    bg: "bg-success/12",
    text: "text-success",
    dot: "bg-success",
  },
  plum: {
    bg: "bg-plum/15",
    text: "text-plum",
    dot: "bg-plum",
  },
  info: {
    bg: "bg-info/12",
    text: "text-info",
    dot: "bg-info",
  },
  saffron: {
    bg: "bg-saffron/15",
    text: "text-saffron",
    dot: "bg-saffron",
  },
};

const SCHEDULE_ITEMS = [
  {
    id: "1",
    time: "10:00 AM",
    title: "Site Visit",
    subtitle: "Road Resurfacing – Ward 8",
    dotColor: "border-emerald-500",
    iconBg: "bg-[#22c55e]",
    icon: Briefcase,
  },
  {
    id: "2",
    time: "12:30 PM",
    title: "Public Meeting",
    subtitle: "Yamuna Vihar",
    dotColor: "border-amber-500",
    iconBg: "bg-[#a855f7]",
    icon: Users,
  },
  {
    id: "3",
    time: "03:00 PM",
    title: "Review Meeting",
    subtitle: "Development Works",
    dotColor: "border-blue-500",
    iconBg: "bg-[#3b82f6]",
    icon: FileText,
  },
  {
    id: "4",
    time: "06:00 PM",
    title: "Community Interaction",
    subtitle: "Gokulpuri",
    dotColor: "border-amber-500",
    iconBg: "bg-[#f97316]",
    icon: CalendarCheck,
  },
];

export function TodaysSchedule() {
  return (
    <section aria-labelledby="schedule-heading" className="hn-card p-4 sm:p-4.5">
      <header className="flex items-center justify-between border-b border-line pb-2.5">
        <h2 id="schedule-heading" className="text-sm font-bold text-navy">
          Today&apos;s Schedule
        </h2>
        <Link
          href="/dashboard/events"
          className="hn-focus-ring group flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View All
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </header>

      {/* Vertical timeline matching reference screenshot */}
      <div className="relative mt-3.5 space-y-3.5">
        {/* Continuous vertical timeline guide line */}
        <div
          aria-hidden="true"
          className="absolute top-3 bottom-3 left-1 w-0.5 bg-gradient-to-b from-emerald-400 via-amber-400 via-blue-400 to-amber-400"
        />

        {SCHEDULE_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative flex items-center gap-2.5 sm:gap-3">
              {/* Colored ring indicator on line */}
              <div
                className={cn(
                  "relative z-10 size-2.5 shrink-0 rounded-full border-2 bg-white",
                  item.dotColor,
                )}
              />

              {/* Timestamp */}
              <span className="w-14 shrink-0 text-left text-[11px] font-semibold text-slate-700 tabular-nums">
                {item.time}
              </span>

              {/* Solid circular colored icon */}
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-white shadow-2xs",
                  item.iconBg,
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
              </div>

              {/* Event Content */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs sm:text-[13px] font-bold text-navy">
                  {item.title}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

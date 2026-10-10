"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HnWordmark } from "@/components/dashboard/hn-wordmark";
import { SidebarConstituencyCard } from "@/components/dashboard/sidebar-constituency-card";
import { NAV_ITEMS, isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PremiumSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

const primaryItems = NAV_ITEMS.filter((item) => item.group === "primary");
const secondaryItems = NAV_ITEMS.filter((item) => item.group === "secondary");

export function PremiumSidebar({ onNavigate, className }: PremiumSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-surface",
        className,
      )}
    >
      {/* Sticky header stays fixed while rail scrolls */}
      <div className="sticky top-0 z-20 shrink-0 bg-surface/95 px-4 pt-4 pb-2.5 backdrop-blur-xs">
        <HnWordmark />
      </div>

      {/* Navigation list */}
      <nav aria-label="Dashboard modules" className="shrink-0 px-2.5 py-1">
        <ul className="flex flex-col gap-0.5">
          {primaryItems.map((item) => (
            <li key={item.id}>
              <SidebarNavItem
                item={item}
                active={isNavItemActive(item, pathname)}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
        <div role="separator" className="mx-2.5 my-1.5 h-px bg-line/70" />
        <ul className="flex flex-col gap-0.5">
          {secondaryItems.map((item) => (
            <li key={item.id}>
              <SidebarNavItem
                item={item}
                active={isNavItemActive(item, pathname)}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* mt-auto pins artwork & constituency controls to bottom when there's room, follows nav when short */}
      <SidebarConstituencyCard />
    </div>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}

function SidebarNavItem({ item, active, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "hn-focus-ring group flex min-h-[34px] items-center gap-2 rounded-lg px-2.5 py-1 text-[0.8rem] leading-snug font-medium transition-colors",
        active
          ? "bg-navy text-white shadow-sm shadow-navy/25"
          : "text-[#1e293b] hover:bg-navy/[0.04]",
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          "size-4 shrink-0",
          active ? "text-white" : "text-[#1e293b]/80 group-hover:text-[#1e293b]",
        )}
        strokeWidth={1.9}
      />
      <span className="min-w-0 flex-1">
        {item.label}
        {item.badge?.kind === "tag" ? (
          <span className="ml-1.5 inline-block -translate-y-px rounded bg-[#f59e0b] px-1.5 py-0.5 align-middle text-[0.5625rem] font-bold tracking-wider text-white shadow-2xs">
            {item.badge.value}
          </span>
        ) : null}
      </span>
      {item.badge?.kind === "count" ? (
        <span
          aria-label={item.badge.label}
          className="min-w-[1.625rem] rounded-full bg-[#ef4444] px-1.5 py-0.5 text-center text-[0.625rem] font-bold tabular-nums text-white shadow-2xs"
        >
          {item.badge.value}
        </span>
      ) : null}
    </Link>
  );
}

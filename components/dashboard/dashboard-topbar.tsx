"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ConstituencySelector } from "@/components/dashboard/constituency-selector";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { GlobalSearch } from "@/components/dashboard/global-search";
import { HnWordmark } from "@/components/dashboard/hn-wordmark";
import { NetaProfileMenu } from "@/components/dashboard/neta-profile-menu";
import { NotificationsPopover } from "@/components/dashboard/notifications-popover";
import { PremiumSidebar } from "@/components/dashboard/premium-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const containerClass = "mx-auto w-full max-w-[1680px] px-4 sm:px-6 xl:px-8";

export function DashboardTopbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrolled = useScrolled(4);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 border-b transition-[background-color,border-color,box-shadow] duration-200",
          scrolled
            ? "border-line bg-canvas/92 shadow-[0_6px_20px_-18px_rgb(11_27_69/0.5)] backdrop-blur-md"
            : "border-transparent bg-canvas lg:bg-transparent",
        )}
      >
        <div className={cn(containerClass, "flex h-topbar items-center gap-2 sm:gap-3")}>
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger
              aria-label="Open navigation"
              className="hn-focus-ring -ml-1.5 inline-flex size-11 shrink-0 items-center justify-center rounded-control text-navy hover:bg-muted lg:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-sidebar max-w-[85vw] gap-0 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">HamaraNeta dashboard modules</SheetDescription>
              <PremiumSidebar onNavigate={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>

          <HnWordmark className="shrink-0 lg:hidden" />

          <div className="flex min-w-0 flex-1 items-center justify-end md:justify-start md:pl-2 lg:pl-0">
            <GlobalSearch className="max-w-[25rem]" />
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ConstituencySelector className="hidden max-w-52 lg:inline-flex" />
            <DateRangeSelector className="hidden lg:inline-flex" />
            <NotificationsPopover />
            <span aria-hidden className="mx-0.5 hidden h-7 w-px bg-line xl:block" />
            <NetaProfileMenu />
          </div>
        </div>
      </header>

      <div className={cn(containerClass, "grid grid-cols-2 gap-2 pt-1 lg:hidden")}>
        <ConstituencySelector className="w-full justify-between" />
        <DateRangeSelector className="w-full justify-between" />
      </div>
    </>
  );
}

function useScrolled(threshold: number): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}

"use client";

import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { KEY_INSIGHTS } from "@/lib/mock-data";
import type { KeyInsightTone } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<KeyInsightTone, string> = {
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/15 text-[#b45309]",
  success: "bg-success/12 text-[#15803d]",
  info: "bg-info/10 text-info",
};

interface KeyInsightsSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function KeyInsightsSheet({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  showTrigger = false,
}: KeyInsightsSheetProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {showTrigger ? (
        <SheetTrigger asChild>
          <Button className="h-10 gap-2 rounded-control bg-saffron px-4 text-[0.8125rem] font-semibold text-white shadow-[0_6px_16px_-6px_color-mix(in_oklab,var(--color-saffron)_70%,transparent)] hover:bg-[#f06c0c]">
            <Lightbulb aria-hidden="true" className="size-4" />
            View Key Insights
          </Button>
        </SheetTrigger>
      ) : null}
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-line">
          <SheetTitle className="text-navy">Key insights for today</SheetTitle>
          <SheetDescription>
            What needs your attention in the constituency, ranked by urgency.
          </SheetDescription>
        </SheetHeader>
        <ol className="flex flex-col gap-3 overflow-y-auto p-4">
          {KEY_INSIGHTS.map((insight) => {
            const Icon = insight.icon;
            return (
              <li key={insight.id} className="hn-card p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-control",
                      TONE_CLASSES[insight.tone],
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-navy">{insight.title}</h3>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-muted">
                      {insight.detail}
                    </p>
                    <Link
                      href={insight.href}
                      onNavigate={() => setOpen(false)}
                      className="hn-focus-ring mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-sm text-[0.8125rem] font-semibold text-info hover:underline"
                    >
                      {insight.actionLabel}
                      <ArrowRight aria-hidden="true" className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-auto border-t border-line px-4 py-3 text-xs text-ink-muted">
          Demo insights · generated from sample constituency data.
        </p>
      </SheetContent>
    </Sheet>
  );
}

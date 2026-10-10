import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { AnimatedValue } from "@/components/dashboard/animated-value";
import { KpiSparkline } from "@/components/dashboard/kpi-sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { DashboardMetric, MetricTone } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE_TILE: Record<MetricTone, string> = {
  danger: "bg-[#fee2e2] text-[#ef4444]",
  success: "bg-[#dcfce7] text-[#22b573]",
  saffron: "bg-[#fef3c7] text-[#d97706]",
  plum: "bg-[#ede9fe] text-[#7c3aed]",
};

const TONE_TEXT: Record<MetricTone, string> = {
  danger: "text-[#ef4444]",
  success: "text-[#22b573]",
  saffron: "text-[#22b573]",
  plum: "text-[#7c3aed]",
};

/* Hex values because SVG presentation attributes do not resolve CSS variables. */
const TONE_STROKE: Record<MetricTone, string> = {
  danger: "#ef4444",
  success: "#22b573",
  saffron: "#f59e0b",
  plum: "#8b5cf6",
};

export function formatMetricValue(metric: DashboardMetric): string | null {
  if (metric.value === null) return null;
  const number = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: metric.decimals,
    maximumFractionDigits: metric.decimals,
  }).format(metric.value);
  return metric.unit ? `${number}\u00A0${metric.unit}` : number;
}

export function KpiCard({ metric }: { metric: DashboardMetric }) {
  const Icon = metric.icon;
  const formatted = formatMetricValue(metric);
  const isUp = metric.trendDirection === "up";
  const TrendIcon = isUp ? ArrowUp : ArrowDown;
  const accessibleName = formatted
    ? `${metric.label}: ${formatted}, ${isUp ? "up" : "down"} ${metric.trendPercent}% ${metric.comparisonLabel}`
    : `${metric.label}: data unavailable`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={metric.href}
          aria-label={accessibleName}
          className="hn-card hn-card-interactive hn-focus-ring flex items-center justify-between gap-2.5 sm:gap-3 p-3.5 sm:p-4 shadow-card transition-all hover:shadow-raised"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full shadow-2xs",
                TONE_TILE[metric.tone],
              )}
            >
              <Icon aria-hidden="true" className="size-5.5" strokeWidth={2.2} />
            </span>

            <div className="min-w-0 shrink-0">
              <p className="text-xl sm:text-[1.35rem] leading-tight font-bold tracking-tight text-navy tabular-nums whitespace-nowrap">
                <AnimatedValue
                  value={metric.value}
                  decimals={metric.decimals}
                  unit={metric.unit}
                />
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink-muted leading-tight whitespace-nowrap">
                {metric.label}
              </p>
              <p
                className={cn(
                  "mt-1 flex items-center gap-0.5 text-xs font-bold leading-none whitespace-nowrap",
                  TONE_TEXT[metric.tone],
                )}
              >
                <TrendIcon aria-hidden="true" className="size-3 stroke-[2.5]" />
                <span>{metric.trendPercent}%</span>
                <span className="ml-1 font-normal text-ink-muted text-[11px]">
                  {metric.comparisonLabel}
                </span>
              </p>
            </div>
          </div>

          <div aria-hidden="true" className="h-10 w-20 sm:w-24 lg:w-28 shrink-0 min-w-[64px] ml-auto">
            {formatted && metric.sparkline.length > 1 ? (
              <KpiSparkline data={metric.sparkline} color={TONE_STROKE[metric.sparklineTone]} />
            ) : (
              <div className="mt-auto h-1/2 border-b border-dashed border-line" />
            )}
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-64 text-pretty">
        {metric.description}
      </TooltipContent>
    </Tooltip>
  );
}

export function KpiCardSkeleton() {
  return (
    <div aria-hidden="true" className="hn-card flex items-center justify-between gap-3 p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  );
}

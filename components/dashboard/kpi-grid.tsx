import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/kpi-card";
import type { DashboardMetric } from "@/lib/types";

const GRID_CLASS = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-4";

export function KpiGrid({ metrics }: { metrics: readonly DashboardMetric[] }) {
  if (metrics.length === 0) {
    return (
      <section aria-label="Key metrics" className="hn-card px-4 py-6 text-center">
        <p className="text-sm font-medium text-navy">Key metrics are not available yet</p>
        <p className="mt-1 text-xs text-ink-muted">
          Figures appear here once the constituency data sources finish syncing.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Key metrics" className={GRID_CLASS}>
      {metrics.map((metric) => (
        <KpiCard key={metric.id} metric={metric} />
      ))}
    </section>
  );
}

export function KpiGridSkeleton() {
  return (
    <div role="status" aria-label="Loading key metrics" className={GRID_CLASS}>
      {Array.from({ length: 4 }, (_, index) => (
        <KpiCardSkeleton key={index} />
      ))}
    </div>
  );
}

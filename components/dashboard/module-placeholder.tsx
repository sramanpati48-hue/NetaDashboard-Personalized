import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getNavItem } from "@/lib/navigation";
import type { ModuleId } from "@/lib/types";

export function ModulePlaceholder({ moduleId }: { moduleId: ModuleId }) {
  const item = getNavItem(moduleId);
  const Icon = item.icon;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-6 sm:py-10">
      <section className="hn-card overflow-hidden">
        <div className="relative border-b border-line bg-[linear-gradient(135deg,var(--color-navy)_0%,var(--color-navy-deep)_100%)] px-6 py-8 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]"
          />
          <div className="relative flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-white/10 ring-1 ring-white/15">
              <Icon aria-hidden className="size-6 text-white" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-saffron uppercase">
                Module coming soon
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
                {item.label}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:px-8">
          <div>
            <h2 className="hn-eyebrow">Planned capabilities</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 text-sm text-ink">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/12">
                    <Check aria-hidden className="size-3 text-success" strokeWidth={2.5} />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <Button asChild size="lg" className="h-11 rounded-control px-4">
            <Link href="/dashboard">
              <ArrowLeft aria-hidden data-icon="inline-start" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

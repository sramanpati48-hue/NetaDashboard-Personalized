import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ConstituencyCommandMap } from "@/components/map/constituency-command-map";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Constituency Overview" };

export default function ConstituencyPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="hn-eyebrow text-saffron">North East Delhi · Lok Sabha</p>
          <h1 className="mt-1 text-xl font-semibold text-navy sm:text-2xl">Constituency Overview</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Complaints, works, public assets, events and booths across the constituency.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-11 gap-2 rounded-control border-line text-navy lg:h-10"
        >
          <Link href="/dashboard">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <ConstituencyCommandMap variant="full" />
    </div>
  );
}

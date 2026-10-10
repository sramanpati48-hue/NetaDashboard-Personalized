import type { Metadata } from "next";
import { AiResponseStudio } from "@/components/dashboard/ai-response-studio";
import { GreetingHero } from "@/components/dashboard/greeting-hero";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { LiveIntelligenceCard } from "@/components/dashboard/live-intelligence-card";
import { QuoteBannerCard } from "@/components/dashboard/quote-banner-card";
import { RecentDevelopmentWorks } from "@/components/dashboard/recent-development-works";
import { TodaysSchedule } from "@/components/dashboard/todays-schedule";
import { ConstituencyCommandMap } from "@/components/map/constituency-command-map";
import { DASHBOARD_METRICS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Home — HamaraNeta Premium",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 xl:gap-5 pb-8">
      <h1 className="sr-only">Manoj Tiwari — North East Delhi constituency dashboard</h1>

      {/* 1. Hero Section: Real photograph cutout, Delhi skyline, Hindi quote, weather, insights CTA */}
      <GreetingHero />

      {/* 2. KPI Layer: Complaints, Works, Events, Sanctioned funds with sparklines */}
      <KpiGrid metrics={DASHBOARD_METRICS} />

      {/* Row 4: Constituency Command Map & Live Video Intelligence Side-by-Side */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.98fr)_minmax(0,1fr)] xl:gap-4 items-stretch">
        <ConstituencyCommandMap />
        <LiveIntelligenceCard />
      </div>

      {/* Row 5: 3 Columns - Recent Development Works, Today's Schedule, and AI Studio + Quote Banner */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1.48fr)] xl:gap-4 items-stretch">
        <RecentDevelopmentWorks />
        <TodaysSchedule />
        <div className="flex flex-col justify-between gap-3.5">
          <AiResponseStudio />
          <QuoteBannerCard />
        </div>
      </div>
    </div>
  );
}

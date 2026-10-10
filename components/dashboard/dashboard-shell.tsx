import { DashboardProvider } from "@/components/dashboard/dashboard-provider";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { PremiumSidebar } from "@/components/dashboard/premium-sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-dvh bg-canvas">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-control bg-navy px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-sidebar border-r border-line lg:block">
          <PremiumSidebar />
        </aside>

        <div className="flex min-h-dvh min-w-0 flex-col lg:pl-sidebar">
          <DashboardTopbar />
          <main
            id="main-content"
            className="mx-auto w-full max-w-[1680px] min-w-0 flex-1 px-4 pt-4 pb-10 sm:px-6 lg:pt-2 xl:px-8"
          >
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}

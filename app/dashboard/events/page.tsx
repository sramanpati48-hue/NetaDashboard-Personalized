import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";

export const metadata: Metadata = { title: "Events & Visits" };

export default function EventsPage() {
  return <ModulePlaceholder moduleId="events" />;
}

import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";

export const metadata: Metadata = { title: "People & Outreach" };

export default function OutreachPage() {
  return <ModulePlaceholder moduleId="outreach" />;
}

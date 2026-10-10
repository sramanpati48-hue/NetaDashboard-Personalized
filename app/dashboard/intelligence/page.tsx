import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";

export const metadata: Metadata = { title: "Social & Opposition Intel" };

export default function IntelligencePage() {
  return <ModulePlaceholder moduleId="intelligence" />;
}

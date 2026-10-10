import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";

export const metadata: Metadata = { title: "Works Tracker" };

export default function WorksPage() {
  return <ModulePlaceholder moduleId="works" />;
}

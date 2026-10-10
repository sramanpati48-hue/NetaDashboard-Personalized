import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";

export const metadata: Metadata = { title: "Complaints" };

export default function ComplaintsPage() {
  return <ModulePlaceholder moduleId="complaints" />;
}

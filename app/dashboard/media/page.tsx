import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";

export const metadata: Metadata = { title: "Media & Social" };

export default function MediaPage() {
  return <ModulePlaceholder moduleId="media" />;
}

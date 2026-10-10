import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";

export const metadata: Metadata = { title: "Letter Management" };

export default function LettersPage() {
  return <ModulePlaceholder moduleId="letters" />;
}

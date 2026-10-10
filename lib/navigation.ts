import {
  BookOpen,
  CalendarDays,
  Clapperboard,
  FileText,
  House,
  Mail,
  Settings,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import type { ModuleId, NavItem } from "@/lib/types";

export const NAV_ITEMS: readonly NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/dashboard",
    icon: House,
    group: "primary",
    description: "Daily command view of the constituency.",
    highlights: [],
  },
  {
    id: "constituency",
    label: "Constituency Overview",
    href: "/dashboard/constituency",
    icon: BookOpen,
    group: "primary",
    description:
      "Ward-level demographics, booth coverage and assembly segment health for North East Delhi.",
    highlights: [
      "Ward and booth boundary explorer",
      "Assembly segment scorecards",
      "Population and service coverage layers",
    ],
  },
  {
    id: "works",
    label: "Works Tracker",
    href: "/dashboard/works",
    icon: UserCheck,
    group: "primary",
    description:
      "Every sanctioned development work from sanction to handover, with geotagged proof and delay alerts.",
    highlights: [
      "Stage-wise progress and fund utilisation",
      "Contractor and agency accountability",
      "Before / after geotagged evidence",
    ],
  },
  {
    id: "intelligence",
    label: "Social & Opposition Intel",
    href: "/dashboard/intelligence",
    icon: ShieldCheck,
    group: "primary",
    description:
      "Monitor opposition claims and public sentiment, with evidence-backed fact checks and human-approved responses.",
    highlights: [
      "Live opposition media monitoring",
      "Claim extraction and evidence matching",
      "Draft responses routed for approval",
    ],
    badge: { kind: "tag", value: "NEW" },
  },
  {
    id: "complaints",
    label: "Complaints",
    href: "/dashboard/complaints",
    icon: ShieldCheck,
    group: "primary",
    description:
      "Citizen grievances routed to the right department, tracked to resolution with SLA visibility.",
    highlights: [
      "Department routing and SLA tracking",
      "Ward-wise hotspot analysis",
      "Citizen follow-up history",
    ],
    badge: { kind: "count", value: 124, label: "124 open complaints" },
  },
  {
    id: "outreach",
    label: "People & Outreach",
    href: "/dashboard/outreach",
    icon: User,
    group: "primary",
    description:
      "Karyakarta network, community leaders and RWA contacts organised for structured outreach.",
    highlights: [
      "Volunteer and leader directory",
      "Outreach campaigns by ward",
      "Engagement history",
    ],
  },
  {
    id: "events",
    label: "Events & Visits",
    href: "/dashboard/events",
    icon: CalendarDays,
    group: "primary",
    description:
      "Plan site visits, public meetings and Jan Samvaad events with briefing notes and follow-ups.",
    highlights: [
      "Visit planning with route context",
      "Briefing packs per event",
      "Post-event action items",
    ],
  },
  {
    id: "letters",
    label: "Letter Management",
    href: "/dashboard/letters",
    icon: Mail,
    group: "primary",
    description:
      "Inward and outward correspondence with ministries, departments and citizens in one register.",
    highlights: [
      "Inward / outward letter register",
      "Department follow-up reminders",
      "Template-based drafting",
    ],
  },
  {
    id: "media",
    label: "Media & Social",
    href: "/dashboard/media",
    icon: Clapperboard,
    group: "primary",
    description:
      "Press coverage, social channels and the media asset library for the office.",
    highlights: [
      "Coverage tracking across outlets",
      "Social channel performance",
      "Approved media asset library",
    ],
  },
  {
    id: "reports",
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    group: "primary",
    description:
      "Presentation-ready reports on works, complaints and outreach for reviews and public updates.",
    highlights: [
      "Monthly constituency report",
      "Works and fund utilisation summaries",
      "Export to PDF and slides",
    ],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    group: "secondary",
    description:
      "Office team access, notification preferences and constituency configuration.",
    highlights: [
      "Team roles and permissions",
      "Notification preferences",
      "Constituency and data sources",
    ],
  },
];

export function getNavItem(id: ModuleId): NavItem {
  const item = NAV_ITEMS.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown module: ${id}`);
  return item;
}

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/dashboard") return pathname === "/dashboard";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

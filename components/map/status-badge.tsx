import { cn } from "@/lib/utils";

const STATUS_TONES: Record<string, string> = {
  "in progress": "bg-saffron/12 text-[#c2410c] ring-saffron/30",
  completed: "bg-success/12 text-[#15803d] ring-success/30",
  operational: "bg-success/12 text-[#15803d] ring-success/30",
  delayed: "bg-danger/10 text-[#b91c1c] ring-danger/25",
  escalated: "bg-danger/10 text-[#b91c1c] ring-danger/25",
  open: "bg-warning/15 text-[#b45309] ring-warning/30",
  "under maintenance": "bg-warning/15 text-[#b45309] ring-warning/30",
  assigned: "bg-info/10 text-info ring-info/25",
  "in review": "bg-info/10 text-info ring-info/25",
  planned: "bg-info/10 text-info ring-info/25",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone =
    STATUS_TONES[status.toLowerCase()] ??
    (status.toLowerCase().startsWith("today")
      ? "bg-plum/12 text-[#6d28d9] ring-plum/30"
      : "bg-canvas text-ink-muted ring-line");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap ring-1",
        tone,
        className,
      )}
    >
      {status}
    </span>
  );
}

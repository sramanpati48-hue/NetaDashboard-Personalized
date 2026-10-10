import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapLoadingState({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-[#eef1f5]",
        "bg-[linear-gradient(rgb(11_27_69/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(11_27_69/0.04)_1px,transparent_1px)] bg-size-[32px_32px]",
        className,
      )}
    >
      <span className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-muted shadow-card">
        <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin text-navy motion-reduce:animate-none" />
        Loading constituency map…
      </span>
    </div>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

export function HnWordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      aria-label="HamaraNeta Premium — go to dashboard home"
      className={cn("hn-focus-ring flex flex-col gap-1 rounded-md", className)}
    >
      <span
        aria-hidden
        className="text-[1.6rem] leading-none font-black tracking-[-0.06em] text-navy"
      >
        HN
      </span>
      <span className="flex items-center gap-1.5">
        <span className="text-[0.8125rem] font-semibold tracking-tight text-navy">
          HamaraNeta
        </span>
        <span className="rounded-[4px] bg-[#f59e0b]/25 px-1.5 py-0.5 text-[0.5625rem] font-bold tracking-[0.08em] text-[#92400e] ring-1 ring-[#f59e0b]/40">
          PREMIUM
        </span>
      </span>
    </Link>
  );
}

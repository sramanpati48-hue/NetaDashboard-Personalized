"use client";

import { Bell, MessageSquareWarning, Radar, Settings, Workflow } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NOTIFICATIONS } from "@/lib/mock-data";
import type { NotificationItem, NotificationKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_STYLE: Record<NotificationKind, { icon: typeof Bell; tone: string }> = {
  intel: { icon: Radar, tone: "bg-ai/10 text-ai" },
  complaint: { icon: MessageSquareWarning, tone: "bg-danger/10 text-danger" },
  work: { icon: Workflow, tone: "bg-saffron/12 text-saffron" },
};

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(() => [...NOTIFICATIONS]);
  const unreadCount = items.filter((item) => item.unread).length;

  function markRead(id: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  }

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        className="hn-focus-ring relative inline-flex size-11 shrink-0 items-center justify-center rounded-control text-navy transition-colors hover:bg-surface hover:shadow-card data-[state=open]:bg-surface data-[state=open]:shadow-card lg:size-10"
      >
        <Bell aria-hidden className="size-5" strokeWidth={1.9} />
        {unreadCount > 0 ? (
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.625rem] leading-4 font-semibold text-white ring-2 ring-canvas"
          >
            {unreadCount}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-1.5rem))] gap-0 p-0">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-navy">Notifications</p>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="hn-focus-ring rounded-md px-1.5 py-1 text-xs font-medium text-info hover:underline disabled:pointer-events-none disabled:text-ink-muted"
          >
            Mark all as read
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {items.map((item) => {
            const { icon: Icon, tone } = KIND_STYLE[item.kind];
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onNavigate={() => {
                    markRead(item.id);
                    setOpen(false);
                  }}
                  className="hn-focus-ring flex gap-3 px-4 py-3 transition-colors hover:bg-muted/70"
                >
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-[9px]", tone)}>
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start gap-2">
                      <span
                        className={cn(
                          "min-w-0 flex-1 text-[0.8125rem] leading-snug text-navy",
                          item.unread ? "font-semibold" : "font-medium",
                        )}
                      >
                        {item.title}
                      </span>
                      {item.unread ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-info">
                          <span className="sr-only">Unread</span>
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-ink-muted">{item.description}</span>
                    <span className="mt-1 block text-[0.6875rem] text-ink-muted/80">{item.timeAgo}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-line p-1.5">
          <Link
            href="/dashboard/settings"
            onNavigate={() => setOpen(false)}
            className="hn-focus-ring flex h-10 items-center justify-center gap-2 rounded-md text-xs font-medium text-navy hover:bg-muted"
          >
            <Settings aria-hidden className="size-3.5" />
            Notification settings
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

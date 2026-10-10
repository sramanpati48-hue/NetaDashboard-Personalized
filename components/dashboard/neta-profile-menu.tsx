"use client";

import { ChevronDown, LogOut, MapPin, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RepresentativeAvatar } from "@/components/dashboard/representative-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CONSTITUENCIES, NETA_PROFILE } from "@/lib/mock-data";

const homeSeat =
  CONSTITUENCIES.find((c) => c.id === NETA_PROFILE.homeConstituencyId)?.name ?? "";
const roleLine = `${NETA_PROFILE.role}, ${homeSeat}`;

export function NetaProfileMenu() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label={`${NETA_PROFILE.name}, ${roleLine}. Open profile menu`}
          className="hn-focus-ring flex h-11 shrink-0 items-center gap-2.5 rounded-control py-1 pr-1.5 pl-1 transition-colors hover:bg-surface hover:shadow-card data-[state=open]:bg-surface data-[state=open]:shadow-card lg:h-12"
        >
          <RepresentativeAvatar size={36} />
          <span className="hidden min-w-0 text-left md:block">
            <span className="block truncate text-[0.8125rem] leading-tight font-semibold text-navy">
              {NETA_PROFILE.name}
            </span>
            <span className="block truncate text-[0.6875rem] leading-tight text-ink-muted">
              {roleLine}
            </span>
          </span>
          <ChevronDown aria-hidden className="hidden size-3.5 shrink-0 text-ink-muted sm:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 p-1.5">
          <DropdownMenuLabel className="flex items-center gap-2.5 py-2">
            <RepresentativeAvatar size={32} />
            <span className="min-w-0">
              <span className="block truncate text-[0.8125rem] font-semibold text-navy">
                {NETA_PROFILE.name}
              </span>
              <span className="block truncate text-[0.6875rem] font-normal text-ink-muted">
                {roleLine}
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="min-h-10" onSelect={() => setProfileOpen(true)}>
            <UserRound aria-hidden />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="min-h-10" onSelect={() => router.push("/dashboard/settings")}>
            <Settings aria-hidden />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="min-h-10"
            onSelect={() =>
              toast("Sign out is not connected in this demo", {
                description: "Authentication will be wired to the HN identity service.",
              })
            }
          >
            <LogOut aria-hidden />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
          <div className="flex flex-col items-center bg-[linear-gradient(160deg,var(--color-navy)_0%,var(--color-navy-deep)_100%)] px-6 pt-7 pb-6 text-center">
            <RepresentativeAvatar size={72} className="ring-offset-navy" />
            <DialogHeader className="mt-4 items-center gap-1">
              <DialogTitle className="text-lg font-semibold text-white">{NETA_PROFILE.name}</DialogTitle>
              <DialogDescription className="text-white/70">
                Member of Parliament · {NETA_PROFILE.house}
              </DialogDescription>
            </DialogHeader>
          </div>
          <dl className="grid gap-3 px-6 py-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-ink-muted">
                <MapPin aria-hidden className="size-4" />
                Constituency
              </dt>
              <dd className="font-medium text-navy">{homeSeat}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-ink-muted">
                <UserRound aria-hidden className="size-4" />
                Role
              </dt>
              <dd className="font-medium text-navy">{roleLine}</dd>
            </div>
          </dl>
          <div className="border-t border-line px-6 py-4">
            <Button
              className="h-10 w-full rounded-control"
              onClick={() => {
                setProfileOpen(false);
                router.push("/dashboard/settings");
              }}
            >
              Open account settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

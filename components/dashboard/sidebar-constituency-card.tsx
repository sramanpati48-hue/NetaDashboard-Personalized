"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/asset-config";

export function SidebarConstituencyCard() {
  const civic = ASSETS.sidebarCivic;

  if (!civic.src) return null;

  return (
    <div
      className="pointer-events-none relative mt-auto w-full shrink-0 select-none overflow-hidden"
      aria-hidden
    >
      <Image
        src={civic.src}
        alt="India Gate Delhi Background"
        width={768}
        height={1376}
        priority
        sizes="260px"
        className="block h-auto w-full select-none"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 4%, black 10%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 4%, black 10%)",
        }}
      />
    </div>
  );
}

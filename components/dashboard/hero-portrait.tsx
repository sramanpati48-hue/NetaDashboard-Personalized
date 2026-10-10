"use client";

import Image from "next/image";
import { useState } from "react";
import { ASSETS } from "@/lib/asset-config";
import { cn } from "@/lib/utils";

interface HeroPortraitProps {
  className?: string;
}

/*
 * Renders the leader photo from ASSETS.netaHeroPortrait, faded into the hero.
 * Until a real photo is supplied it shows a neutral, clearly labelled
 * silhouette — never an illustrated likeness.
 */
export function HeroPortrait({ className }: HeroPortraitProps) {
  const { src, alt, objectPosition } = ASSETS.netaHeroPortrait;
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showPhoto && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 220px, 140px"
          className="object-cover [mask-image:linear-gradient(to_bottom,black_70%,transparent),linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] [mask-composite:intersect]"
          style={{ objectPosition }}
          onError={() => setFailed(true)}
        />
      ) : (
        <RepresentativeSilhouette label={alt} />
      )}
    </div>
  );
}

function RepresentativeSilhouette({ label }: { label: string }) {
  return (
    <figure
      role="img"
      aria-label={`Representative photo placeholder for ${label}`}
      className="relative flex size-full items-end justify-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] top-[6%] bottom-0 rounded-t-full border border-white/70 bg-linear-to-b from-white/75 via-white/45 to-white/0 shadow-[inset_0_1px_0_white]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 120 140"
        className="relative h-[82%] w-auto text-navy/18"
        fill="currentColor"
      >
        <circle cx="60" cy="44" r="24" />
        <path d="M14 140c0-30 20-50 46-50s46 20 46 50z" />
      </svg>
      <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-2 py-0.5 text-[0.625rem] font-medium tracking-wide whitespace-nowrap text-ink-muted shadow-sm ring-1 ring-line">
        Representative photo
      </figcaption>
    </figure>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { ASSETS } from "@/lib/asset-config";
import { NETA_PROFILE } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface RepresentativeAvatarProps {
  size?: number;
  className?: string;
}

export function RepresentativeAvatar({ size = 36, className }: RepresentativeAvatarProps) {
  const { src, alt, objectPosition } = ASSETS.netaHeadshot;
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy ring-2 ring-saffron/70 ring-offset-2 ring-offset-surface",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showPhoto && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size * 2}px`}
          className="object-cover"
          style={{ objectPosition }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          role="img"
          aria-label={alt}
          className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--color-navy)_70%,white)_0%,var(--color-navy)_60%,var(--color-navy-deep)_100%)] font-semibold tracking-wide text-white"
          style={{ fontSize: Math.round(size * 0.36) }}
        >
          {NETA_PROFILE.initials}
        </span>
      )}
    </span>
  );
}

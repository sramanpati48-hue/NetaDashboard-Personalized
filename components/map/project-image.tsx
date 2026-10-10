"use client";

import { HardHat } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectImageProps {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
}

/** Local site photo, or a designed placeholder until the photo is supplied. */
export function ProjectImage({ src, alt, sizes, className }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-navy", className)}>
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          role="img"
          aria-label={`${alt} — site photo pending`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-[radial-gradient(120%_90%_at_20%_0%,#1d3370_0%,var(--color-navy)_55%,var(--color-navy-deep)_100%)]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-size-[18px_18px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-[repeating-linear-gradient(135deg,rgb(255_122_24/0.22)_0_10px,transparent_10px_20px)] [mask-image:linear-gradient(to_top,black,transparent)]"
          />
          <HardHat aria-hidden="true" className="relative size-6 text-saffron" strokeWidth={1.75} />
          <span className="relative text-[0.625rem] font-medium tracking-[0.08em] text-white/70 uppercase">
            Site photo pending
          </span>
        </div>
      )}
    </div>
  );
}

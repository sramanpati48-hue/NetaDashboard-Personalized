"use client";

import Image from "next/image";

export function QuoteBannerCard() {
  return (
    <aside
      aria-label="Mission quote"
      className="relative isolate overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all"
    >
      <div className="sr-only">
        <blockquote>North East Delhi ke har ward ka vikas, hum sab milkar karenge.</blockquote>
        <cite>— Manoj Tiwari</cite>
      </div>

      <div className="relative w-full aspect-[1104/336] overflow-hidden bg-gradient-to-r from-[#edf2f8] via-[#f7f0ea] to-[#faeee3]">
        <Image
          src="/images/hero/quote_card_ultra_clean.png"
          alt="Quote by Manoj Tiwari: North East Delhi ke har ward ka vikas, hum sab milkar karenge."
          fill
          priority
          sizes="(min-width: 1536px) 500px, (min-width: 1024px) 450px, 100vw"
          className="object-cover object-center select-none"
        />
      </div>
    </aside>
  );
}


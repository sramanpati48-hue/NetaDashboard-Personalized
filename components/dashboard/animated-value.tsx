"use client";

import { useEffect, useState } from "react";

interface AnimatedValueProps {
  value: number | null;
  decimals: number;
  unit?: string;
}

export function AnimatedValue({ value, decimals, unit }: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    if (value === null) return;
    const targetVal = value;
    const duration = 1000;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(ease * targetVal);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(targetVal);
      }
    }

    const frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  if (value === null) return null;

  const numberStr = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue);

  return <span className="whitespace-nowrap">{unit ? `${numberStr}\u00A0${unit}` : numberStr}</span>;
}

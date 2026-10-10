"use client";

import { useReducedMotion } from "framer-motion";
import { useId } from "react";
import { Area, AreaChart, YAxis } from "recharts";

interface KpiSparklineProps {
  data: readonly number[];
  color: string;
}

export function KpiSparkline({ data, color }: KpiSparklineProps) {
  const gradientId = `spark-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reduceMotion = useReducedMotion();
  const points = data.map((value, index) => ({ index, value }));

  return (
    <AreaChart
      responsive
      data={points}
      margin={{ top: 3, right: 1, bottom: 3, left: 1 }}
      style={{ width: "100%", height: "100%" }}
      accessibilityLayer={false}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.24} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis hide domain={["dataMin", "dataMax"]} />
      <Area
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={1.75}
        fill={`url(#${gradientId})`}
        dot={false}
        activeDot={false}
        isAnimationActive={!reduceMotion}
        animationDuration={900}
      />
    </AreaChart>
  );
}

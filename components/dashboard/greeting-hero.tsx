"use client";

import Image from "next/image";
import { useState } from "react";
import { CloudSun, Droplets, MapPin, Sparkles, Wind } from "lucide-react";
import { KeyInsightsSheet } from "@/components/dashboard/key-insights-sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GREETING_SNAPSHOT } from "@/lib/mock-data";

export function GreetingHero() {
  const { greeting, weather } = GREETING_SNAPSHOT;
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [weatherModalOpen, setWeatherModalOpen] = useState(false);

  return (
    <section
      aria-labelledby="hero-greeting"
      className="relative isolate overflow-hidden rounded-card border border-line/80 bg-surface shadow-card transition-all"
    >
      {/* Screen-reader accessible metadata */}
      <div className="sr-only">
        <h2 id="hero-greeting">{greeting}, Manoj Ji</h2>
        <p>&ldquo;Seva, Vikas aur Dilli ke logon ka bharosa hamari sabse badi taakat hai.&rdquo; — Manoj Tiwari</p>
        <p>North East Delhi ka Vikas, Meri Prathmikta</p>
        <p>
          Weather: {weather.dateLabel}, {weather.location}, {weather.temperatureC}°C {weather.condition}
        </p>
      </div>

      {/* Pristine High-Resolution Visual Banner matching User Reference Mockup with full head and zero quality loss */}
      <div className="relative w-full aspect-[2120/288] overflow-hidden bg-gradient-to-r from-[#fefbf9] via-[#fffaf5] to-[#fcf3ea]">
        <Image
          src="/images/hero/hero_banner_ultra_clean.png"
          alt="Manoj Tiwari - Good Evening Manoj Ji - North East Delhi ka Vikas, Meri Prathmikta"
          fill
          priority
          sizes="(min-width: 1536px) 1400px, (min-width: 1024px) 1100px, 100vw"
          className="w-full h-full object-cover block select-none"
        />

        {/* Interactive Glassmorphic Hotspot for Weather Widget */}
        <button
          type="button"
          onClick={() => setWeatherModalOpen(true)}
          aria-label="View North East Delhi Weather and AQI Details"
          className="hn-focus-ring absolute rounded-2xl opacity-0 hover:opacity-100 hover:bg-white/35 hover:backdrop-blur-xs hover:ring-2 hover:ring-amber-400/50 hover:shadow-md cursor-pointer transition-all duration-150"
          style={{
            left: "81.13%",
            top: "25%",
            width: "18.16%",
            height: "36.11%",
          }}
          title="Click to view North East Delhi Weather & AQI"
        />

        {/* Interactive Subtle Hotspot directly overlaying 'View Key Insights →' CTA */}
        <button
          type="button"
          onClick={() => setInsightsOpen(true)}
          aria-label="View Key Insights"
          className="hn-focus-ring absolute rounded-full opacity-0 hover:opacity-100 hover:bg-navy/10 hover:ring-2 hover:ring-indigo-500/40 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer transition-all duration-150"
          style={{
            left: "87.03%",
            top: "69.44%",
            width: "12.26%",
            height: "25%",
          }}
          title="Open Key Insights Briefing"
        />
      </div>

      {/* Key Insights Drawer */}
      <KeyInsightsSheet open={insightsOpen} onOpenChange={setInsightsOpen} />

      {/* Weather & Civic Environment Dialog */}
      <Dialog open={weatherModalOpen} onOpenChange={setWeatherModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CloudSun className="size-5 text-saffron" />
              <DialogTitle className="text-navy">North East Delhi Weather & Environment</DialogTitle>
            </div>
            <DialogDescription>
              Real-time civic meteorological conditions across Yamuna Vihar, Mustafabad & Gokulpuri.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="rounded-control bg-canvas p-3 border border-line">
              <span className="text-[11px] text-ink-muted">Temperature</span>
              <p className="mt-1 text-2xl font-bold text-navy">28°C</p>
              <span className="text-[11px] font-medium text-success">Clear & Sunny</span>
            </div>

            <div className="rounded-control bg-canvas p-3 border border-line">
              <span className="text-[11px] text-ink-muted">Air Quality Index (AQI)</span>
              <p className="mt-1 text-2xl font-bold text-amber-600">142</p>
              <span className="text-[11px] font-medium text-amber-700">Moderate · PWD Mist Active</span>
            </div>

            <div className="rounded-control bg-canvas p-3 border border-line flex items-center gap-2.5">
              <Droplets className="size-4 text-info shrink-0" />
              <div>
                <span className="text-[11px] text-ink-muted">Humidity</span>
                <p className="font-bold text-navy">45%</p>
              </div>
            </div>

            <div className="rounded-control bg-canvas p-3 border border-line flex items-center gap-2.5">
              <Wind className="size-4 text-plum shrink-0" />
              <div>
                <span className="text-[11px] text-ink-muted">Wind</span>
                <p className="font-bold text-navy">12 km/h NW</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

"use client";

import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck,
  Pause,
  Play,
  Share2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LIVE_INTELLIGENCE } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type TabKey = "transcript" | "claims" | "analysis" | "evidence";

export function LiveIntelligenceCard() {
  const intel = LIVE_INTELLIGENCE;
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<"1x" | "1.5x" | "2x">("1x");
  const [activeTab, setActiveTab] = useState<TabKey>("transcript");
  const [fullModalOpen, setFullModalOpen] = useState(false);

  // Simulated audio playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackSeconds((prev) => (prev >= 84 ? 0 : prev + 1));
    }, 1000 / (playbackSpeed === "1x" ? 1 : playbackSpeed === "1.5x" ? 1.5 : 2));
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const currentMinutes = Math.floor(playbackSeconds / 60);
  const currentSecs = playbackSeconds % 60;
  const timeFormatted = `${currentMinutes}:${currentSecs.toString().padStart(2, "0")}`;

  function toggleSpeed() {
    const nextSpeed = playbackSpeed === "1x" ? "1.5x" : playbackSpeed === "1.5x" ? "2x" : "1x";
    setPlaybackSpeed(nextSpeed);
    toast.info(`Playback speed set to ${nextSpeed}`);
  }

  return (
    <>
      <section
        aria-labelledby="live-intelligence-heading"
        className="hn-card flex flex-col overflow-hidden"
      >
        {/* Top Header: Dark Navy with LIVE badge */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0a1128] px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
              <span className="size-2 animate-pulse rounded-full bg-red-500" />
              LIVE
            </span>
            <h2 id="live-intelligence-heading" className="text-xs font-bold text-white sm:text-[13px]">
              Latest from North East Delhi
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">{intel.timeAgo}</span>
        </header>

        {/* Video Player & Real Thumbnail Card */}
        <div className="bg-[#0a1128] p-3 border-b border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            {/* Real Video Thumbnail */}
            <div className="relative h-13 w-23 shrink-0 overflow-hidden rounded-md border border-white/15 bg-slate-900 shadow-sm">
              <Image
                src="/images/intelligence/tiwari_video_speech_16_9.jpg"
                alt="Manoj Tiwari speech at public rally"
                fill
                sizes="160px"
                className="object-cover object-center"
              />
            </div>

            {/* Title & Hashtags */}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-bold text-white leading-tight">
                {intel.title}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-blue-400">
                {intel.hashtags.join(" ")}
              </p>
            </div>

            {/* Circular Blue Play Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause audio broadcast" : "Play audio broadcast"}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-md transition-all hover:bg-blue-600 active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="size-4 fill-white" />
              ) : (
                <Play className="size-4 fill-white translate-x-0.5" />
              )}
            </button>
          </div>

          {/* Audio Waveform Row */}
          <div className="flex items-center gap-2 pt-1 text-white/80">
            <span className="w-8 text-[11px] font-mono font-medium tabular-nums text-slate-300">
              {timeFormatted}
            </span>

            {/* Animated SVG Audio Waveform */}
            <div className="flex flex-1 items-center justify-between gap-[2px] h-5 px-1 overflow-hidden">
              {[4, 8, 12, 16, 22, 14, 18, 24, 16, 12, 20, 26, 18, 14, 10, 16, 22, 28, 20, 14, 8, 12, 18, 24, 16, 10, 6, 12, 18, 14, 10, 6, 4].map((h, i) => {
                const isActive = (i / 33) * 84 <= playbackSeconds;
                return (
                  <span
                    key={i}
                    className={cn(
                      "w-[3px] rounded-full transition-all duration-150",
                      isActive
                        ? "bg-gradient-to-t from-purple-400 to-indigo-300 shadow-[0_0_6px_rgba(168,85,247,0.6)]"
                        : "bg-indigo-900/60",
                      isPlaying && "animate-pulse",
                    )}
                    style={{
                      height: `${isPlaying ? Math.max(4, Math.sin(Date.now() / 200 + i) * 12 + h * 0.7) : h * 0.7}px`,
                      animationDelay: `${i * 40}ms`,
                    }}
                  />
                );
              })}
            </div>

            <span className="text-[11px] font-mono font-medium tabular-nums text-slate-400">
              {intel.duration}
            </span>

            {/* Speed Toggle Pill */}
            <button
              type="button"
              onClick={toggleSpeed}
              className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-white/20 transition-colors"
            >
              {playbackSpeed}
            </button>

            {/* Download Icon */}
            <button
              type="button"
              onClick={() => toast.success("Downloading intelligence briefing audio...")}
              title="Download audio briefing"
              className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Download className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Intelligence Tabs */}
        <div className="flex border-b border-line bg-surface text-xs font-semibold px-2">
          <button
            type="button"
            onClick={() => setActiveTab("transcript")}
            className={cn(
              "border-b-2 py-2 px-3 text-center transition-colors",
              activeTab === "transcript"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            Transcript
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("claims")}
            className={cn(
              "flex items-center gap-1 border-b-2 py-2 px-3 text-center transition-colors",
              activeTab === "claims"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            Key Claims <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#ede9fe] text-[10px] font-bold text-[#7c3aed]">3</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("analysis")}
            className={cn(
              "border-b-2 py-2 px-3 text-center transition-colors",
              activeTab === "analysis"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            AI Analysis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("evidence")}
            className={cn(
              "flex items-center gap-1 border-b-2 py-2 px-3 text-center transition-colors",
              activeTab === "evidence"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            Evidence <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#ede9fe] text-[10px] font-bold text-[#7c3aed]">{intel.evidenceCount}</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="flex flex-1 flex-col justify-between bg-surface p-3">
          {activeTab === "transcript" && (
            <div className="space-y-1.5">
              {intel.transcriptLines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="font-mono text-[11px] font-semibold text-[#818cf8] tabular-nums">
                    {line.time}
                  </span>
                  <p className="flex-1 text-[12px] font-medium text-slate-800">{line.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "claims" && (
            <div className="space-y-2">
              {intel.keyClaims.map((claim, idx) => (
                <div key={idx} className="rounded-control bg-canvas p-2 text-xs">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-navy">{claim.claim}</p>
                    <Badge variant="outline" className="border-danger/30 bg-danger/10 text-[9px] font-bold text-danger">
                      Debunked
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-ink-muted">{claim.fact}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="rounded-control bg-plum/10 p-2.5 text-xs text-navy">
              <div className="flex items-center gap-1.5 font-bold text-plum">
                <Sparkles className="size-3.5" />
                Strategic AI Brief
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink">{intel.aiAnalysis}</p>
            </div>
          )}

          {activeTab === "evidence" && (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between rounded-control border border-line p-2">
                <span className="flex items-center gap-1.5 font-medium text-navy">
                  <FileCheck className="size-3.5 text-success" />
                  Mustafabad Road DPR (PWD/2024/78)
                </span>
                <span className="text-[10px] font-bold text-success">Verified</span>
              </div>
              <div className="flex items-center justify-between rounded-control border border-line p-2">
                <span className="flex items-center gap-1.5 font-medium text-navy">
                  <FileCheck className="size-3.5 text-success" />
                  Yamuna Vihar CHC Gazetted Inauguration
                </span>
                <span className="text-[10px] font-bold text-success">Verified</span>
              </div>
            </div>
          )}

          {/* View Full Transcript button */}
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => setFullModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-md bg-[#f3f0ff] px-3 py-1.5 text-[11px] font-semibold text-[#6d28d9] transition-colors hover:bg-[#ede9fe]"
            >
              View Full Transcript
              <ArrowRight className="size-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Full Transcript Dialog */}
      <Dialog open={fullModalOpen} onOpenChange={setFullModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-navy">{intel.title}</DialogTitle>
            <DialogDescription>
              Complete automated Devanagari Hindi transcript with timestamped claim verification.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 space-y-3 overflow-y-auto pr-2 text-xs">
            {intel.transcriptLines.map((line, idx) => (
              <div key={idx} className="flex gap-2.5 rounded-control bg-canvas p-2.5">
                <span className="font-mono font-bold text-plum tabular-nums">{line.time}</span>
                <div>
                  <p className="font-medium text-navy">{line.text}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-success">
                    <CheckCircle2 className="size-3" /> Fact-checked against constituency records
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

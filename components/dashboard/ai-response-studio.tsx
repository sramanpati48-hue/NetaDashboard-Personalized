"use client";

import {
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  FileText,
  PenTool,
  Sparkles,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type StudioActionKey = "fact-check" | "generate-post" | "video-script" | "draft-response";

interface ActionMeta {
  title: string;
  hindiText: string;
  englishText: string;
  evidence: string[];
}

const ACTION_DATA: Record<StudioActionKey, ActionMeta> = {
  "fact-check": {
    title: "Instant Fact Check",
    hindiText:
      "तथ्य जांच परिणाम: उत्तर पूर्वी दिल्ली में सड़कों और अस्पतालों को लेकर किए गए विपक्षी दावे भ्रामक पाए गए। मुस्तफाबाद मुख्य मार्ग का 4.2 किमी रीसर्फेसिंग कार्य ₹12.5 करोड़ की लागत से 72% पूर्ण है और यमुना विहार में 30 बेड का CHC अस्पताल जनवरी 2025 से पूरी तरह क्रियाशील है।",
    englishText:
      "Fact-Check Verified: Claims regarding neglect of roads and hospitals in North East Delhi are factually misleading. 4.2 km of Mustafabad main road resurfacing (₹12.5 Cr) is 72% complete, and the 30-bed Yamuna Vihar CHC is fully operational since Jan 2025.",
    evidence: [
      "PWD Delhi Work Order #PWD-2024-889 (Sanctioned ₹12.5 Cr)",
      "Directorate of Health Services Gazetted Notification (CHC Yamuna Vihar)",
      "Lok Sabha Question Reply #LS-3420 (MPLADS Utilization: 94.6%)",
    ],
  },
  "generate-post": {
    title: "Generate Social Media Post",
    hindiText:
      "सच्चाई काम बोलती है, झूठ नहीं!\n\nउत्तर पूर्वी दिल्ली के यमुना विहार में ₹28.4 करोड़ की लागत से बनकर तैयार आधुनिक सामुदायिक स्वास्थ्य केंद्र (CHC) आज क्षेत्रवासियों को 24x7 निःशुल्क चिकित्सा सेवा दे रहा है। मुस्तफाबाद की सड़कों का कायाकल्प भी अंतिम चरण में है।\n\nजनता का विश्वास ही हमारी सबसे बड़ी शक्ति है। 🇮🇳\n#VikasKiRajniti #NorthEastDelhi #ManojTiwari",
    englishText:
      "Development speaks louder than false claims!\n\nThe state-of-the-art Community Health Centre in Yamuna Vihar (₹28.4 Cr) is actively serving citizens 24x7. Road resurfacing across Mustafabad is 72% complete. Committed to holistic progress for North East Delhi.\n\n#NorthEastDelhi #DelhiDevelopment",
    evidence: [
      "Photographic evidence attached: /images/projects/community-health-centre.jpg",
      "Ward 12 local resident feedback survey score: 91% positive",
    ],
  },
  "video-script": {
    title: "Bite-Sized Video Script",
    hindiText:
      "[कैमरा: मनोज तिवारी जी सीधे जनता से मुखातिब]\n'नमस्कार उत्तर पूर्वी दिल्ली के मेरे परिवारजनों!\nकुछ लोग चुनाव आते ही पुराने झूठ दोहराने लगते हैं। लेकिन आज जब आप यमुना विहार जाते हैं, तो वहां 30 बेड का आधुनिक अस्पताल जनता की सेवा में खड़ा है। मुस्तफाबाद में 4.2 किमी नई सड़क बन रही है। हम काम करते हैं, फोटो खिंचवाने नहीं आते।'\n[दृश्य: अस्पताल और सड़क निर्माण के प्रमाणित वीडियो फुटेज]",
    englishText:
      "[Camera: MP Manoj Tiwari direct address]\n'Namaskar North East Delhi! Ahead of elections, political opponents circulate old misinformation. But ground reality speaks: Yamuna Vihar CHC is open with emergency care, and Mustafabad roads are getting transformed. We deliver on ground.'",
    evidence: [
      "Visual B-Roll: Drone footage of Mustafabad resurfacing",
      "Visual B-Roll: Inauguration plaque of Yamuna Vihar CHC",
    ],
  },
  "draft-response": {
    title: "Official Press Response",
    hindiText:
      "कार्यालय सांसद, उत्तर पूर्वी दिल्ली — प्रेस वक्तव्य:\n\n'विपक्षी प्रवक्ताओं द्वारा उत्तर पूर्वी दिल्ली के विकास कार्यों पर दिए गए अनर्गल बयानों का खंडन किया जाता है। सांसद मनोज तिवारी जी के प्रयासों से पिछले पांच वर्षों में ₹125 करोड़ से अधिक की केंद्रीय और MPLADS योजनाएं धरातल पर उतरी हैं। किसी भी सार्वजनिक मंच पर खुली बहस की चुनौती है।'",
    englishText:
      "Office of Member of Parliament, North East Delhi — Press Release:\n\n'We categorically refute the unfounded claims by opposition representatives. Over ₹125 Crore worth of public development projects have been executed across North East Delhi under MP Manoj Tiwari's tenure. Verifiable records are open for public audit.'",
    evidence: [
      "Official Parliamentary Record of MPLADS expenditures 2020-2025",
      "Public Works Department milestone completion certificate",
    ],
  },
};

export function AiResponseStudio() {
  const [activeModal, setActiveModal] = useState<StudioActionKey | null>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  const selectedData = activeModal ? ACTION_DATA[activeModal] : null;

  return (
    <>
      <section aria-labelledby="ai-studio-heading" className="hn-card p-4 sm:p-4.5">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#5455ea] text-white shadow-sm">
              <Sparkles className="size-4.5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 id="ai-studio-heading" className="text-[14px] font-bold text-navy">
                  AI Response Studio
                </h2>
                <span className="rounded-full bg-[#ffedd5] px-1.5 py-0.5 text-[9px] font-bold text-[#ea580c] ring-1 ring-[#fed7aa]/50">
                  NEW
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
                Get fact-checked insights and create responses with your AI assistant.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal("fact-check")}
            aria-label="Open AI Assistant"
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600 cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </header>

        {/* 4 Quick Action Buttons matching reference screenshot */}
        <div className="mt-3.5 grid grid-cols-4 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setActiveModal("fact-check")}
            className="hn-focus-ring flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-3 text-center transition-all hover:border-emerald-300 hover:shadow-xs active:scale-98 cursor-pointer"
          >
            <CheckCircle2 className="size-5 text-[#16a34a]" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-slate-800 leading-tight">
              Fact<br />Check
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("generate-post")}
            className="hn-focus-ring flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#e9d5ff] bg-[#faf5ff] px-1.5 py-3 text-center transition-all hover:border-purple-300 hover:shadow-xs active:scale-98 cursor-pointer"
          >
            <FileText className="size-5 text-[#9333ea]" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-slate-800 leading-tight">
              Generate<br />Post
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("video-script")}
            className="hn-focus-ring flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#bae6fd] bg-[#f0f9ff] px-1.5 py-3 text-center transition-all hover:border-sky-300 hover:shadow-xs active:scale-98 cursor-pointer"
          >
            <Video className="size-5 text-[#0284c7]" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-slate-800 leading-tight">
              Video<br />Script
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("draft-response")}
            className="hn-focus-ring flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#ddd6fe] bg-[#f5f3ff] px-1.5 py-3 text-center transition-all hover:border-indigo-300 hover:shadow-xs active:scale-98 cursor-pointer"
          >
            <PenTool className="size-5 text-[#7c3aed]" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-slate-800 leading-tight">
              Draft<br />Response
            </span>
          </button>
        </div>
      </section>

      {/* Response Preview Modal */}
      <Dialog open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
        {selectedData && (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-plum" />
                <DialogTitle className="text-navy">{selectedData.title}</DialogTitle>
              </div>
              <DialogDescription>
                AI-drafted narrative grounded directly in official constituency infrastructure data.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-1">
              {/* Hindi Draft */}
              <div className="rounded-card border border-line bg-canvas p-3.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-line/60">
                  <span className="text-xs font-bold text-navy">हिंदी प्रारूप (Hindi Draft)</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(selectedData.hindiText)}
                    className="h-7 gap-1 text-[11px]"
                  >
                    {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                    Copy
                  </Button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink whitespace-pre-line">
                  {selectedData.hindiText}
                </p>
              </div>

              {/* English Draft */}
              <div className="rounded-card border border-line bg-canvas p-3.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-line/60">
                  <span className="text-xs font-bold text-navy">English Release</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(selectedData.englishText)}
                    className="h-7 gap-1 text-[11px]"
                  >
                    <Copy className="size-3" />
                    Copy
                  </Button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink whitespace-pre-line">
                  {selectedData.englishText}
                </p>
              </div>

              {/* Source & Evidence Drawer */}
              <div className="rounded-control border border-line/80 bg-surface p-3 text-xs">
                <p className="font-bold text-navy">Verified Sources & Citations:</p>
                <ul className="mt-1.5 space-y-1 text-ink-muted">
                  {selectedData.evidence.map((ev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-success" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("Exported PDF briefing document!")}
                  className="gap-1.5 text-xs"
                >
                  <Download className="size-3.5" />
                  Export Briefing
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleCopy(selectedData.hindiText);
                    setActiveModal(null);
                  }}
                  className="bg-navy hover:bg-navy/90 text-xs"
                >
                  Copy & Close
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

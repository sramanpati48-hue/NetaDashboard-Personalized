import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s · HamaraNeta Premium",
    default: "HamaraNeta Premium",
  },
  description:
    "Constituency command dashboard for Manoj Tiwari, MP North East Delhi.",
};

export const viewport: Viewport = {
  themeColor: "#0b1b45",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${devanagari.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

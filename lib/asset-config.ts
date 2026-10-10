import type { PhotoAsset } from "@/lib/types";

/*
 * Single source for every photographic asset on the dashboard.
 *
 * To use a real photo: copy it into the matching /public/images/<folder>/
 * directory and set `src` to its path (e.g. "/images/profile/manoj-tiwari.jpg").
 * While `src` is null, components render their designed fallback instead of a
 * broken image.
 */
type AssetKey = "netaHeadshot" | "netaHeroPortrait" | "heroSkyline" | "sidebarCivic";

export const ASSETS: Record<AssetKey, PhotoAsset> = {
  netaHeadshot: {
    src: "/images/profile/manoj_tiwari_avatar.png",
    alt: "Manoj Tiwari, MP North East Delhi",
    objectPosition: "50% 50%",
  },
  netaHeroPortrait: {
    src: "/images/hero/hero_banner_ultra_clean.png",
    alt: "Manoj Tiwari, MP North East Delhi",
    objectPosition: "50% 50%",
  },
  heroSkyline: {
    src: "/images/hero/delhi-skyline.jpg",
    alt: "Delhi Skyline India Gate",
    objectPosition: "100% 50%",
  },
  sidebarCivic: {
    src: "/images/sidebar/delhi_gate_warm_sunset_v2.webp",
    alt: "India Gate Delhi",
    objectPosition: "50% 50%",
  },
};

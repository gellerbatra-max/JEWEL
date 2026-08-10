"use client";

// TEMPORARY colour-scheme lab. Visit http://localhost:3000/color-lab — click a
// palette to recolour the whole homepage live. Tell me which you like and I'll
// set it in globals.css and delete this page.
import { useEffect, useState } from "react";
import { HomeContent } from "@/components/HomeContent";

type Scheme = {
  name: string;
  porcelain: string; // page background
  cloud: string; // secondary surfaces
  ink: string; // text + dark buttons
  stone: string; // muted text
  gold: string; // accent
};

const SCHEMES: Scheme[] = [
  { name: "Ceylon Gold (current)", porcelain: "#fbfaf7", cloud: "#f3f0e9", ink: "#1c1b19", stone: "#6e6a63", gold: "#9a7b3f" },
  { name: "Platinum & Steel", porcelain: "#f7f8f8", cloud: "#edeef0", ink: "#1e2024", stone: "#6c7176", gold: "#7c8794" },
  { name: "Rose Gold & Blush", porcelain: "#faf5f2", cloud: "#f4e7df", ink: "#2a211d", stone: "#85736b", gold: "#b47b63" },
  { name: "Emerald & Ivory", porcelain: "#f6f8f4", cloud: "#e8efe8", ink: "#1a231d", stone: "#647069", gold: "#2f6b4c" },
  { name: "Sapphire & Ivory", porcelain: "#f7f8fb", cloud: "#e8edf4", ink: "#191f2a", stone: "#656f7e", gold: "#2f4c82" },
  { name: "Bronze & Char", porcelain: "#f8f6f2", cloud: "#efe9df", ink: "#211d18", stone: "#736a5f", gold: "#8a6a3a" },
  { name: "Noir & Champagne", porcelain: "#f6f5f2", cloud: "#eceae3", ink: "#141414", stone: "#6a6862", gold: "#b99a54" },
];

function inkRgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export default function ColorLab() {
  const [idx, setIdx] = useState(0);
  const s = SCHEMES[idx];

  useEffect(() => {
    const root = document.documentElement;
    const vars: Record<string, string> = {
      "--porcelain": s.porcelain,
      "--cloud": s.cloud,
      "--ink": s.ink,
      "--stone": s.stone,
      "--gold": s.gold,
      "--line": inkRgba(s.ink, 0.12),
      "--line-soft": inkRgba(s.ink, 0.07),
    };
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
    document.body.style.paddingBottom = "84px";
    return () => {
      for (const k of Object.keys(vars)) root.style.removeProperty(k);
      document.body.style.paddingBottom = "";
    };
  }, [idx, s]);

  return (
    <>
      <HomeContent heroBlend />

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#141414] text-[#faf9f6]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 px-5 py-3.5">
          <span className="text-[11px] tracking-[0.18em] uppercase text-white/50">Palette</span>
          <div className="flex flex-wrap items-center gap-2">
            {SCHEMES.map((sc, i) => {
              const on = i === idx;
              return (
                <button
                  key={sc.name}
                  onClick={() => setIdx(i)}
                  title={sc.name}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-colors ${
                    on ? "border-white/70 bg-white/10" : "border-white/15 hover:border-white/40"
                  }`}
                >
                  <span className="flex">
                    <span className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: sc.porcelain }} />
                    <span className="-ml-2 h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: sc.gold }} />
                    <span className="-ml-2 h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: sc.ink }} />
                  </span>
                  <span className="text-[11px] tracking-[0.06em] whitespace-nowrap">{sc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

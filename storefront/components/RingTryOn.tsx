"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Ring "try-on". Two free modes that reuse the white-background product photo
// (blended with multiply so the white ground disappears over skin):
//   • Photo  — drop a hand photo, drag the ring onto a finger, size + rotate.
//   • Camera — live hand tracking (MediaPipe) auto-places the ring (beta).
// This is a visual guide; proportions are approximate.

type Mode = "photo" | "camera";
type Placement = { x: number; y: number; size: number; rot: number };

const DEFAULT: Placement = { x: 50, y: 55, size: 26, rot: 0 };

// MediaPipe Tasks Vision, loaded from CDN at runtime (kept out of the bundle).
const VISION_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";
const VISION_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
type VisionModule = {
  FilesetResolver: { forVisionTasks: (u: string) => Promise<unknown> };
  HandLandmarker: {
    createFromOptions: (
      f: unknown,
      o: unknown
    ) => Promise<{ detectForVideo: (v: HTMLVideoElement, t: number) => unknown }>;
  };
};

export function RingTryOn({
  ringImage,
  ringTitle,
  onClose,
}: {
  ringImage: string;
  ringTitle: string;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>("photo");
  const [photo, setPhoto] = useState<string | null>(null);
  const [place, setPlace] = useState<Placement>(DEFAULT);

  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLImageElement>(null);
  const dragging = useRef(false);

  // Camera mode
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camState, setCamState] = useState<"idle" | "loading" | "running" | "error">("idle");
  const [camMsg, setCamMsg] = useState("");
  const rafRef = useRef<number | null>(null);
  const landmarkerRef = useRef<{ detectForVideo: (v: HTMLVideoElement, t: number) => unknown } | null>(
    null
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Write placement to the ring element.
  const apply = useCallback((p: Placement) => {
    const el = ringRef.current;
    if (!el) return;
    el.style.left = `${p.x}%`;
    el.style.top = `${p.y}%`;
    el.style.width = `${p.size}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${p.rot}deg)`;
  }, []);

  useEffect(() => {
    if (mode === "photo") apply(place);
  }, [place, mode, apply]);

  // ---- Photo mode: drag the ring ----
  function onPointerDown(e: React.PointerEvent) {
    if (mode !== "photo" || !photo) return;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlace((p) => ({ ...p, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }));
  }
  function onPointerUp() {
    dragging.current = false;
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
    setPlace(DEFAULT);
  }

  // ---- Camera mode: MediaPipe hand tracking ----
  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const v = videoRef.current;
    const stream = v?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (v) v.srcObject = null;
  }, []);

  const startCamera = useCallback(async () => {
    setCamState("loading");
    setCamMsg("Starting camera…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
        audio: false,
      });
      const v = videoRef.current;
      if (!v) return;
      v.srcObject = stream;
      await v.play();

      setCamMsg("Loading hand tracking…");
      const vision = (await import(/* turbopackIgnore: true */ VISION_URL)) as VisionModule;
      const fileset = await vision.FilesetResolver.forVisionTasks(VISION_WASM);
      const landmarker = await vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        numHands: 1,
        runningMode: "VIDEO",
      });
      landmarkerRef.current = landmarker;
      setCamState("running");
      setCamMsg("");

      const loop = () => {
        const vid = videoRef.current;
        const lm = landmarkerRef.current;
        if (!vid || !lm) return;
        try {
          const res = lm.detectForVideo(vid, performance.now()) as {
            landmarks?: { x: number; y: number }[][];
          };
          const hand = res.landmarks?.[0];
          if (hand && hand.length >= 18) {
            // Ring finger: MCP (13) → PIP (14); place the ring near the base.
            const mcp = hand[13];
            const pip = hand[14];
            const pinky = hand[17];
            const px = (0.6 * mcp.x + 0.4 * pip.x) * 100;
            const py = (0.6 * mcp.y + 0.4 * pip.y) * 100;
            const fingerW = Math.hypot(mcp.x - pinky.x, mcp.y - pinky.y) * 100;
            const angle =
              (Math.atan2(pip.y - mcp.y, pip.x - mcp.x) * 180) / Math.PI + 90;
            apply({ x: px, y: py, size: Math.max(12, Math.min(40, fingerW * 1.4)), rot: angle });
            if (ringRef.current) ringRef.current.style.opacity = "1";
          } else if (ringRef.current) {
            ringRef.current.style.opacity = "0";
          }
        } catch {
          /* frame skipped */
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      stopCamera();
      setCamState("error");
      setCamMsg(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera permission was declined. You can use the Upload Photo tab instead."
          : "Live camera couldn't start on this device. Try the Upload Photo tab."
      );
    }
  }, [apply, stopCamera]);

  // Switch modes: start/stop the camera.
  useEffect(() => {
    if (mode === "camera") startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [mode, startCamera, stopCamera]);

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`flex-1 py-2.5 text-[11px] tracking-[0.14em] uppercase transition-colors ${
        mode === m ? "bg-ink text-porcelain" : "text-stone hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Try on the ${ringTitle}`}>
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden border border-line bg-porcelain shadow-[0_40px_90px_-45px_rgba(28,27,25,0.55)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="font-display text-lg text-ink">Try On</p>
          <button type="button" onClick={onClose} aria-label="Close" className="text-lg leading-none text-stone hover:text-ink">
            ✕
          </button>
        </div>

        <div className="flex border-b border-line">
          {tab("photo", "Upload Photo")}
          {tab("camera", "Use Camera")}
        </div>

        {/* Stage */}
        <div ref={stageRef} className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-cloud">
          {mode === "photo" ? (
            photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5v14M5 12h14" /></svg>
                </span>
                <span className="text-[13px] text-stone">Upload a photo of your hand</span>
                <input type="file" accept="image/*" onChange={onFile} className="hidden" />
              </label>
            )
          ) : (
            <video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover" />
          )}

          {/* The ring overlay (both modes) */}
          {(mode === "camera" || photo) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={ringRef}
              src={ringImage}
              alt=""
              draggable={false}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="pointer-events-auto absolute select-none mix-blend-multiply"
              style={{ left: `${DEFAULT.x}%`, top: `${DEFAULT.y}%`, width: `${DEFAULT.size}%`, transform: "translate(-50%,-50%)", cursor: mode === "photo" ? "grab" : "default", touchAction: "none" }}
            />
          )}

          {mode === "camera" && camState !== "running" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-porcelain/85 px-6 text-center">
              <p className="text-[13.5px] text-ink">{camMsg || "Preparing camera…"}</p>
              {camState === "error" && (
                <button
                  type="button"
                  onClick={() => setMode("photo")}
                  className="mt-2 bg-ink px-5 py-2.5 text-[11px] tracking-[0.14em] uppercase text-porcelain hover:bg-gold"
                >
                  Upload a photo instead
                </button>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3 px-5 py-4">
          {mode === "photo" && photo && (
            <>
              <Slider label="Size" value={place.size} min={10} max={55} onChange={(v) => setPlace((p) => ({ ...p, size: v }))} />
              <Slider label="Rotate" value={place.rot} min={-180} max={180} onChange={(v) => setPlace((p) => ({ ...p, rot: v }))} />
              <div className="flex items-center justify-between pt-1 text-[11px] tracking-[0.1em] uppercase">
                <label className="cursor-pointer text-stone hover:text-ink">
                  Change photo
                  <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                </label>
                <button type="button" onClick={() => setPlace(DEFAULT)} className="text-stone hover:text-ink">
                  Reset
                </button>
              </div>
            </>
          )}
          <p className="text-[11px] leading-relaxed text-stone">
            {mode === "photo"
              ? "Drag the ring onto your finger, then adjust size and angle. A visual guide — proportions are approximate."
              : "Point the back camera at your hand. Live tracking is in beta and approximate."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-[11px] tracking-[0.1em] uppercase text-stone">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 accent-gold"
      />
    </label>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Cross-fades through a set of images automatically. Used for the home
// "Made to Order" section. Light on resources: opacity transitions run on the
// compositor, it pauses when off-screen, and it stops entirely for
// prefers-reduced-motion (showing the first image). A single image just displays.
export function RotatingImage({
  images,
  alt,
  className,
  sizes = "(max-width: 768px) 70vw, 460px",
  interval = 4500,
}: {
  images: string[];
  alt: string;
  className?: string;
  sizes?: string;
  interval?: number;
}) {
  const n = images.length;
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const wasVisible = useRef(false);

  // Start at index 0 on the server/first paint (so hydration matches), then each
  // time the section scrolls into view — and on load if it's already in view —
  // jump to a RANDOM photo so it doesn't always begin with the same one.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting && !wasVisible.current && n > 1) {
          setI(Math.floor(Math.random() * n));
        }
        wasVisible.current = e.isIntersecting;
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [n]);

  useEffect(() => {
    if (n <= 1 || !visible) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((p) => (p + 1) % n), interval);
    return () => clearInterval(id);
  }, [n, visible, interval]);

  if (n === 0) return null;

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      {images.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={idx === 0 ? alt : ""}
          fill
          sizes={sizes}
          loading="lazy"
          className={`object-contain mix-blend-multiply transition-opacity duration-[1200ms] ease-in-out ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

"use client";

import { useEffect } from "react";

// Blocks the casual "save image/video" paths site-wide: right-click on
// media and drag-to-desktop. This is deterrence, not real protection —
// screenshots and dev tools can always capture what the browser renders.
export function MediaProtection() {
  useEffect(() => {
    const isMedia = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.tagName === "IMG" || el.tagName === "VIDEO");

    const onContextMenu = (e: MouseEvent) => {
      if (isMedia(e.target)) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if (isMedia(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}

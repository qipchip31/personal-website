"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const marker = ref.current;
    const scrollRoot = marker?.closest(".finder-window__body");

    if (!(scrollRoot instanceof HTMLElement)) {
      return;
    }

    const root = scrollRoot;

    function updateProgress() {
      const maxScroll = root.scrollHeight - root.clientHeight;
      setProgress(maxScroll > 0 ? root.scrollTop / maxScroll : 0);
    }

    updateProgress();
    root.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      root.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      className="reading-progress"
      ref={ref}
      style={{ "--reading-progress": progress } as CSSProperties}
      aria-hidden="true"
    />
  );
}

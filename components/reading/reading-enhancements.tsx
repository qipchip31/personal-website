"use client";

import { useEffect, useState } from "react";

type LightboxImage = {
  src: string;
  alt: string;
};

type ReadingEnhancementsProps = {
  rootId: string;
};

function getReadableCode(pre: HTMLPreElement): string {
  return pre.innerText.replace(/\ncopy$/, "").trimEnd();
}

export function ReadingEnhancements({ rootId }: ReadingEnhancementsProps) {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const root = document.getElementById(rootId);

    if (!root) {
      return;
    }

    const imageNodes = Array.from(root.querySelectorAll("img"));
    const nextImages = imageNodes.map((image) => ({
      src: image.currentSrc || image.src,
      alt: image.alt,
    }));
    const imageFrame = window.requestAnimationFrame(() => {
      setImages(nextImages);
    });
    const cleanupImages = imageNodes.map((image, index) => {
      function openImage() {
        setActiveIndex(index);
      }

      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openImage();
        }
      }

      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", "open image");
      image.addEventListener("click", openImage);
      image.addEventListener("keydown", handleKeyDown);

      return () => {
        image.removeEventListener("click", openImage);
        image.removeEventListener("keydown", handleKeyDown);
      };
    });

    const preNodes = Array.from(root.querySelectorAll("pre"));
    const cleanupButtons = preNodes.map((pre) => {
      const button = document.createElement("button");
      button.className = "code-copy-button";
      button.type = "button";
      button.textContent = "copy";

      async function copyCode() {
        await navigator.clipboard.writeText(getReadableCode(pre));
        button.textContent = "copied";
        window.setTimeout(() => {
          button.textContent = "copy";
        }, 1200);
      }

      button.addEventListener("click", copyCode);
      pre.append(button);

      return () => {
        button.removeEventListener("click", copyCode);
        button.remove();
      };
    });

    return () => {
      window.cancelAnimationFrame(imageFrame);
      cleanupImages.forEach((cleanup) => cleanup());
      cleanupButtons.forEach((cleanup) => cleanup());
    };
  }, [rootId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (activeIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((activeIndex + 1) % images.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((activeIndex - 1 + images.length) % images.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  if (activeIndex === null || images.length === 0) {
    return null;
  }

  const image = images[activeIndex];

  return (
    <div className="reading-lightbox" role="dialog" aria-modal="true">
      <button
        className="reading-lightbox__close"
        type="button"
        onClick={() => setActiveIndex(null)}
      >
        close
      </button>
      <button
        className="reading-lightbox__nav"
        type="button"
        onClick={() =>
          setActiveIndex((activeIndex - 1 + images.length) % images.length)
        }
      >
        ←
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} />
      <button
        className="reading-lightbox__nav"
        type="button"
        onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
      >
        →
      </button>
      {image.alt ? <p>{image.alt}</p> : null}
    </div>
  );
}

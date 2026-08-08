"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NavigationItem } from "@/config/site";
import { AboutThisMac } from "@/components/shell/about-this-mac";

type MenuBarProps = {
  items: NavigationItem[];
  activeHref: string;
  onNavigate: (item: NavigationItem) => void;
};

function formatLocalTime(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .toLowerCase();
}

export function MenuBar({ items, activeHref, onNavigate }: MenuBarProps) {
  const [time, setTime] = useState("");
  const [isoTime, setIsoTime] = useState("");
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    function updateTime() {
      const now = new Date();

      setTime(formatLocalTime(now));
      setIsoTime(now.toISOString());
    }

    updateTime();
    const timer = window.setInterval(() => {
      updateTime();
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAboutOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="menu-bar">
      <nav className="menu-bar__nav" aria-label="main navigation">
        <button
          className="menu-bar__apple"
          type="button"
          aria-label="apple menu"
          aria-expanded={aboutOpen}
          onClick={() => setAboutOpen(true)}
        >
          <span aria-hidden="true"></span>
        </button>
        {items.map((item) => (
          <Link
            className="menu-bar__item"
            href={item.href}
            key={item.href}
            aria-current={item.href === activeHref ? "page" : undefined}
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              ) {
                return;
              }

              event.preventDefault();
              onNavigate(item);
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <time className="menu-bar__time" dateTime={isoTime}>
        {time}
      </time>
      <AboutThisMac open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </header>
  );
}

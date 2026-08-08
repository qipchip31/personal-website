"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig, type NavigationItem } from "@/config/site";
import { DesktopIcon } from "@/components/shell/desktop-icon";
import { FinderWindow } from "@/components/shell/finder-window";
import { MenuBar } from "@/components/shell/menu-bar";
import { WindowContent } from "@/components/shell/window-content";

type DesktopProps = {
  contentByHref?: Partial<Record<NavigationItem["href"], ReactNode>>;
  initialHref?: NavigationItem["href"];
};

function getNavigationItem(href: NavigationItem["href"]): NavigationItem {
  return (
    siteConfig.navigation.find((item) => item.href === href) ??
    siteConfig.navigation[0]
  );
}

export function Desktop({
  contentByHref = {},
  initialHref = siteConfig.navigation[0].href,
}: DesktopProps) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<NavigationItem>(
    getNavigationItem(initialHref),
  );

  function handleNavigate(item: NavigationItem) {
    setActiveItem(item);
    router.push(item.href);
  }

  return (
    <main className="desktop-shell" aria-label="website shell">
      <div className="desktop">
        <MenuBar
          items={siteConfig.navigation}
          activeHref={activeItem.href}
          onNavigate={handleNavigate}
        />
        <div className="desktop__workspace">
          <FinderWindow title={activeItem.label}>
            <WindowContent key={activeItem.href} section={activeItem.label}>
              {contentByHref[activeItem.href]}
            </WindowContent>
          </FinderWindow>
          <div className="desktop__trash">
            <DesktopIcon label="trash" aria-label="trash" />
          </div>
        </div>
        <div className="desktop__status" aria-hidden="true" />
      </div>
    </main>
  );
}

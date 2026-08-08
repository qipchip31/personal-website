import type { Metadata } from "next";
import { AboutSection } from "@/components/about/about-section";
import { Desktop } from "@/components/shell/desktop";

export const metadata: Metadata = {
  title: "about",
  description: "a short personal note from chirag pradhan.",
};

export default function AboutPage() {
  return (
    <Desktop
      initialHref="/about"
      contentByHref={{
        "/about": <AboutSection />,
      }}
    />
  );
}

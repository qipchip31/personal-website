import { AboutSection } from "@/components/about/about-section";
import { Desktop } from "@/components/shell/desktop";

export default function Home() {
  return <Desktop contentByHref={{ "/about": <AboutSection /> }} />;
}

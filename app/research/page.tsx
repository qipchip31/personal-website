import type { Metadata } from "next";
import { ReadingList } from "@/components/reading/reading-list";
import { Desktop } from "@/components/shell/desktop";
import { getAllResearchEntries } from "@/lib/content";
import { getReadingTime } from "@/lib/reading";

export const metadata: Metadata = {
  title: "research",
  description: "research notes and papers by chirag pradhan.",
};

export default async function ResearchPage() {
  const papers = (await getAllResearchEntries()).map((entry) => ({
    metadata: entry.metadata,
    readingTime: getReadingTime(entry.body),
  }));

  return (
    <Desktop
      initialHref="/research"
      contentByHref={{
        "/research": (
          <ReadingList
            emptyMessage="the references are being sorted before they go on the shelf."
            hrefBase="/research"
            items={papers}
            kind="research"
            label="research"
            openLabel="read →"
          />
        ),
      }}
    />
  );
}

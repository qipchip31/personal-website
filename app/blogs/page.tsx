import type { Metadata } from "next";
import { ReadingList } from "@/components/reading/reading-list";
import { Desktop } from "@/components/shell/desktop";
import { getAllBlogEntries } from "@/lib/content";
import { getReadingTime } from "@/lib/reading";

export const metadata: Metadata = {
  title: "writing",
  description: "notes and essays by chirag pradhan.",
};

export default async function BlogsPage() {
  const essays = (await getAllBlogEntries()).map((entry) => ({
    metadata: entry.metadata,
    readingTime: getReadingTime(entry.body),
  }));

  return (
    <Desktop
      initialHref="/blogs"
      contentByHref={{
        "/blogs": (
          <ReadingList
            emptyMessage="the notebook is open, but this drawer is still being arranged."
            hrefBase="/blogs"
            items={essays}
            kind="writing"
            label="writing"
            openLabel="read →"
          />
        ),
      }}
    />
  );
}

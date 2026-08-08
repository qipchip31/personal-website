import type { Metadata } from "next";
import { ReadingList } from "@/components/reading/reading-list";
import { Desktop } from "@/components/shell/desktop";
import { getAllBuildNoteEntries } from "@/lib/content";
import { getReadingTime } from "@/lib/reading";

export const metadata: Metadata = {
  title: "work",
  description: "a build log of things chirag pradhan has made.",
};

export default async function WorkPage() {
  const notes = (await getAllBuildNoteEntries()).map((note) => ({
    metadata: note.metadata,
    readingTime: getReadingTime(note.body),
  }));

  return (
    <Desktop
      initialHref="/work"
      contentByHref={{
        "/work": (
          <ReadingList
            emptyMessage="the drawer is quiet right now."
            hrefBase="/work"
            items={notes}
            kind="work"
            label="build log"
            openLabel="open note →"
          />
        ),
      }}
    />
  );
}

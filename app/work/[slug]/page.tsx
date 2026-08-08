import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Desktop } from "@/components/shell/desktop";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ReadingEntryShell } from "@/components/reading/reading-entry-shell";
import { getAllBuildNotes, getBuildNote } from "@/lib/content";
import {
  getNoteNavigation,
  getReadingTime,
  getRelatedNotes,
  getTableOfContents,
} from "@/lib/reading";

type BuildNotePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const notes = await getAllBuildNotes();

  return notes.map(({ metadata }) => ({
    slug: metadata.slug,
  }));
}

export async function generateMetadata({
  params,
}: BuildNotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getBuildNote(slug);

  if (!note) {
    return {};
  }

  return {
    title: note.metadata.title,
    description: note.metadata.description,
    openGraph: {
      title: note.metadata.title,
      description: note.metadata.description,
      images: note.metadata.coverImage ? [note.metadata.coverImage] : undefined,
    },
  };
}

export default async function BuildNotePage({ params }: BuildNotePageProps) {
  const { slug } = await params;
  const [note, notes] = await Promise.all([
    getBuildNote(slug),
    getAllBuildNotes(),
  ]);

  if (!note) {
    notFound();
  }

  const readingTime = getReadingTime(note.body);
  const tableOfContents = getTableOfContents(note.body);
  const navigation = getNoteNavigation(notes, note.metadata.slug);
  const relatedNotes = getRelatedNotes(note.metadata, notes);

  return (
    <Desktop
      initialHref="/work"
      contentByHref={{
        "/work": (
          <ReadingEntryShell
            backHref="/work"
            backLabel="← back to work"
            kind="work"
            metadata={note.metadata}
            readingTime={readingTime}
            tableOfContents={tableOfContents}
            navigation={navigation}
            relatedNotes={relatedNotes}
          >
            <MdxContent source={note.body} />
          </ReadingEntryShell>
        ),
      }}
    />
  );
}

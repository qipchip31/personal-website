import type { ContentMetadata, ContentSummary } from "@/lib/content-types";

export type TableOfContentsItem = {
  id: string;
  title: string;
};

export type NoteNavigation = {
  previous?: ContentMetadata;
  next?: ContentMetadata;
};

const wordsPerMinute = 220;

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function removeCodeBlocks(source: string): string {
  return source.replace(/```[\s\S]*?```/g, "");
}

export function getTableOfContents(source: string): TableOfContentsItem[] {
  const content = removeCodeBlocks(source);
  const headings = content.matchAll(/^##\s+(.+)$/gm);

  return Array.from(headings, ([, title]) => ({
    id: slugifyHeading(title),
    title,
  }));
}

export function getReadingTime(source: string): string {
  const text = removeCodeBlocks(source)
    .replace(/<[^>]+>/g, " ")
    .replace(/[^\w\s]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return `${minutes} min`;
}

export function getNoteNavigation(
  notes: ContentSummary[],
  slug: string,
): NoteNavigation {
  const index = notes.findIndex((note) => note.metadata.slug === slug);

  if (index === -1) {
    return {};
  }

  return {
    previous: notes[index + 1]?.metadata,
    next: notes[index - 1]?.metadata,
  };
}

export function getRelatedNotes(
  current: ContentMetadata,
  notes: ContentSummary[],
): ContentMetadata[] {
  return notes
    .filter((note) => note.metadata.slug !== current.slug)
    .map((note) => ({
      metadata: note.metadata,
      score: note.metadata.tags.filter((tag) => current.tags.includes(tag))
        .length,
    }))
    .filter((note) => note.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.metadata.date.localeCompare(a.metadata.date),
    )
    .slice(0, 3)
    .map((note) => note.metadata);
}

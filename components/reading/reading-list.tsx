import Link from "next/link";
import type { ContentMetadata } from "@/lib/content-types";
import { formatNoteDate } from "@/components/reading/date";

export type ReadingListItem = {
  metadata: ContentMetadata;
  readingTime: string;
};

type ReadingListProps = {
  emptyMessage: string;
  hrefBase: string;
  items: ReadingListItem[];
  kind: "research" | "work" | "writing";
  label: string;
  openLabel: string;
};

function getYear(date: string): string {
  return new Date(date).getUTCFullYear().toString();
}

function getMetadataLine(
  metadata: ContentMetadata,
  readingTime: string,
  kind: ReadingListProps["kind"],
): string {
  if (kind === "writing") {
    return `${metadata.category} · ${formatNoteDate(metadata.date)} · ${readingTime}`;
  }

  if (kind === "research") {
    return [metadata.publication, getYear(metadata.date), metadata.status]
      .filter(Boolean)
      .join(" · ");
  }

  return `${formatNoteDate(metadata.date)} · ${metadata.category}`;
}

export function ReadingList({
  emptyMessage,
  hrefBase,
  items,
  kind,
  label,
  openLabel,
}: ReadingListProps) {
  if (items.length === 0) {
    return (
      <div className="work-empty" role="status">
        {emptyMessage}
      </div>
    );
  }

  return (
    <section className="work-index" aria-label={label} data-reading-kind={kind}>
      <p className="work-index__label">{label}</p>
      <ol className="work-list">
        {items.map(({ metadata, readingTime }) => (
          <li className="work-note" key={metadata.slug}>
            <article>
              <h2>
                <Link href={`${hrefBase}/${metadata.slug}`}>
                  {metadata.title}
                </Link>
              </h2>
              <p className="work-note__meta">
                {getMetadataLine(metadata, readingTime, kind)}
              </p>
              {kind === "work" ? (
                <p className="work-note__time">{readingTime}</p>
              ) : null}
              <p className="work-note__summary">{metadata.summary}</p>
              <Link
                className="work-note__open"
                href={`${hrefBase}/${metadata.slug}`}
              >
                {openLabel}
              </Link>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

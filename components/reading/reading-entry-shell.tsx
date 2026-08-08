import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentMetadata } from "@/lib/content-types";
import type { NoteNavigation, TableOfContentsItem } from "@/lib/reading";
import { NoteFooter } from "@/components/reading/note-footer";
import { ReadingEnhancements } from "@/components/reading/reading-enhancements";
import { ReadingProgress } from "@/components/reading/reading-progress";
import { TableOfContents } from "@/components/reading/table-of-contents";
import { formatNoteDate } from "@/components/reading/date";

type ReadingEntryShellProps = {
  backHref: string;
  backLabel: string;
  children: ReactNode;
  kind: "research" | "work" | "writing";
  metadata: ContentMetadata;
  navigation: NoteNavigation;
  readingTime: string;
  relatedNotes: ContentMetadata[];
  tableOfContents: TableOfContentsItem[];
};

function getMetadataLine(
  metadata: ContentMetadata,
  readingTime: string,
  kind: ReadingEntryShellProps["kind"],
): string {
  if (kind === "writing") {
    return `${metadata.category} · ${formatNoteDate(metadata.date)} · ${readingTime}`;
  }

  if (kind === "research") {
    return [metadata.publication, metadata.status, readingTime]
      .filter(Boolean)
      .join(" · ");
  }

  return `${formatNoteDate(metadata.date)} · ${metadata.category} · ${readingTime}`;
}

function ResearchMetadata({ metadata }: { metadata: ContentMetadata }) {
  const links = [
    metadata.paperUrl ? ["paper", metadata.paperUrl] : undefined,
    metadata.codeUrl ? ["code", metadata.codeUrl] : undefined,
    metadata.slidesUrl ? ["slides", metadata.slidesUrl] : undefined,
    metadata.doi ? ["doi", metadata.doi] : undefined,
  ].filter(Boolean) as [string, string][];

  if (
    !metadata.authors &&
    !metadata.conference &&
    !metadata.journal &&
    links.length === 0 &&
    !metadata.citation
  ) {
    return null;
  }

  return (
    <section className="research-meta" aria-label="publication metadata">
      <dl>
        {metadata.authors ? (
          <div>
            <dt>authors</dt>
            <dd>{metadata.authors.join(", ")}</dd>
          </div>
        ) : null}
        {metadata.conference ? (
          <div>
            <dt>conference</dt>
            <dd>{metadata.conference}</dd>
          </div>
        ) : null}
        {metadata.journal ? (
          <div>
            <dt>journal</dt>
            <dd>{metadata.journal}</dd>
          </div>
        ) : null}
        {links.length > 0 ? (
          <div>
            <dt>links</dt>
            <dd>
              {links.map(([label, href], index) => (
                <span key={label}>
                  {index > 0 ? " · " : null}
                  <a href={href}>{label}</a>
                </span>
              ))}
            </dd>
          </div>
        ) : null}
        {metadata.citation ? (
          <div>
            <dt>citation</dt>
            <dd>{metadata.citation}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

export function ReadingEntryShell({
  backHref,
  backLabel,
  children,
  kind,
  metadata,
  navigation,
  readingTime,
  relatedNotes,
  tableOfContents,
}: ReadingEntryShellProps) {
  const contentId = `reading-entry-${metadata.slug}`;

  return (
    <article
      className="build-note-page"
      id={contentId}
      data-reading-kind={kind}
    >
      <ReadingProgress />
      <ReadingEnhancements rootId={contentId} />

      <Link className="build-note-back" href={backHref}>
        {backLabel}
      </Link>

      <header className="build-note-header">
        <h1>{metadata.title}</h1>
        <p>{getMetadataLine(metadata, readingTime, kind)}</p>
        <p>{metadata.description}</p>
      </header>

      <TableOfContents items={tableOfContents} />
      {kind === "research" ? <ResearchMetadata metadata={metadata} /> : null}

      {metadata.coverImage ? (
        <figure className="build-note-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={metadata.coverImage}
            alt=""
            loading="eager"
            decoding="async"
          />
        </figure>
      ) : null}

      <div className="build-note-prose">{children}</div>
      <NoteFooter
        backHref={backHref}
        navigation={navigation}
        relatedNotes={relatedNotes}
      />
    </article>
  );
}

import Link from "next/link";
import type { ContentMetadata } from "@/lib/content-types";
import type { NoteNavigation } from "@/lib/reading";

type NoteFooterProps = {
  backHref: string;
  navigation: NoteNavigation;
  relatedNotes: ContentMetadata[];
};

export function NoteFooter({
  backHref,
  navigation,
  relatedNotes,
}: NoteFooterProps) {
  return (
    <footer className="note-footer">
      <nav className="note-footer__nav" aria-label="note navigation">
        <Link href={backHref}>← back</Link>
        {navigation.previous ? (
          <Link href={`${backHref}/${navigation.previous.slug}`}>
            previous note: {navigation.previous.title}
          </Link>
        ) : null}
        {navigation.next ? (
          <Link href={`${backHref}/${navigation.next.slug}`}>
            next note: {navigation.next.title}
          </Link>
        ) : null}
      </nav>

      {relatedNotes.length > 0 ? (
        <section
          className="note-footer__related"
          aria-label="other things you might enjoy"
        >
          <p>other things you might enjoy</p>
          <ul>
            {relatedNotes.map((note) => (
              <li key={note.slug}>
                <Link href={`${backHref}/${note.slug}`}>→ {note.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </footer>
  );
}

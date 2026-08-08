import type { TableOfContentsItem } from "@/lib/reading";

type TableOfContentsProps = {
  items: TableOfContentsItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length < 2) {
    return null;
  }

  return (
    <nav className="reading-toc" aria-label="table of contents">
      <p>contents</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

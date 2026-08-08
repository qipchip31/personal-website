import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { MermaidDiagram } from "@/components/mdx/mermaid-diagram";
import { slugifyHeading } from "@/lib/reading";

type FigureProps = {
  src: string;
  alt?: string;
  caption?: string;
};

type GalleryProps = {
  children: ReactNode;
};

type VideoProps = {
  src: string;
  caption?: string;
  title?: string;
};

type CalloutProps = {
  type?: "note" | "tip" | "warning" | "important";
  children: ReactNode;
};

export function Figure({ src, alt = "", caption }: FigureProps) {
  return (
    <figure className="mdx-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {(caption ?? alt) ? <figcaption>{caption ?? alt}</figcaption> : null}
    </figure>
  );
}

export function Gallery({ children }: GalleryProps) {
  return <div className="mdx-gallery">{children}</div>;
}

export function Video({ src, caption, title = "video" }: VideoProps) {
  return (
    <figure className="mdx-video">
      <video controls preload="metadata" aria-label={title}>
        <source src={src} />
      </video>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function Callout({ type = "note", children }: CalloutProps) {
  return (
    <aside className="mdx-callout" data-callout={type}>
      <p className="mdx-callout__label">{type}</p>
      {children}
    </aside>
  );
}

function MarkdownImage(props: ComponentPropsWithoutRef<"img">) {
  const alt = props.alt ?? "";

  return (
    <figure className="mdx-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...props} alt={alt} loading="lazy" decoding="async" />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}

function HeadingTwo({ children }: ComponentPropsWithoutRef<"h2">) {
  const text = String(children);

  return <h2 id={slugifyHeading(text)}>{children}</h2>;
}

export const mdxComponents = {
  h2: HeadingTwo,
  img: MarkdownImage,
  Figure,
  Gallery,
  Video,
  Callout,
  Mermaid: MermaidDiagram,
};

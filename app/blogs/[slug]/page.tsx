import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ReadingEntryShell } from "@/components/reading/reading-entry-shell";
import { Desktop } from "@/components/shell/desktop";
import { getAllBlogs, getBlogBySlug } from "@/lib/content";
import {
  getNoteNavigation,
  getReadingTime,
  getRelatedNotes,
  getTableOfContents,
} from "@/lib/reading";

type WritingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const essays = await getAllBlogs();

  return essays.map(({ metadata }) => ({
    slug: metadata.slug,
  }));
}

export async function generateMetadata({
  params,
}: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getBlogBySlug(slug);

  if (!essay) {
    return {};
  }

  return {
    title: essay.metadata.title,
    description: essay.metadata.description,
    openGraph: {
      title: essay.metadata.title,
      description: essay.metadata.description,
      images: essay.metadata.coverImage
        ? [essay.metadata.coverImage]
        : undefined,
    },
  };
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const [essay, essays] = await Promise.all([
    getBlogBySlug(slug),
    getAllBlogs(),
  ]);

  if (!essay) {
    notFound();
  }

  const readingTime = getReadingTime(essay.body);
  const tableOfContents = getTableOfContents(essay.body);
  const navigation = getNoteNavigation(essays, essay.metadata.slug);
  const relatedNotes = getRelatedNotes(essay.metadata, essays);

  return (
    <Desktop
      initialHref="/blogs"
      contentByHref={{
        "/blogs": (
          <ReadingEntryShell
            backHref="/blogs"
            backLabel="← back to writing"
            kind="writing"
            metadata={essay.metadata}
            readingTime={readingTime}
            tableOfContents={tableOfContents}
            navigation={navigation}
            relatedNotes={relatedNotes}
          >
            <MdxContent source={essay.body} />
          </ReadingEntryShell>
        ),
      }}
    />
  );
}

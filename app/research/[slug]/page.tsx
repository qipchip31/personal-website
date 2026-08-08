import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ReadingEntryShell } from "@/components/reading/reading-entry-shell";
import { Desktop } from "@/components/shell/desktop";
import { getAllResearch, getResearch } from "@/lib/content";
import {
  getNoteNavigation,
  getReadingTime,
  getRelatedNotes,
  getTableOfContents,
} from "@/lib/reading";

type ResearchPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const papers = await getAllResearch();

  return papers.map(({ metadata }) => ({
    slug: metadata.slug,
  }));
}

export async function generateMetadata({
  params,
}: ResearchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const paper = await getResearch(slug);

  if (!paper) {
    return {};
  }

  return {
    title: paper.metadata.title,
    description: paper.metadata.description,
    openGraph: {
      title: paper.metadata.title,
      description: paper.metadata.description,
      images: paper.metadata.coverImage
        ? [paper.metadata.coverImage]
        : undefined,
    },
  };
}

export default async function ResearchEntryPage({ params }: ResearchPageProps) {
  const { slug } = await params;
  const [paper, papers] = await Promise.all([
    getResearch(slug),
    getAllResearch(),
  ]);

  if (!paper) {
    notFound();
  }

  const readingTime = getReadingTime(paper.body);
  const tableOfContents = getTableOfContents(paper.body);
  const navigation = getNoteNavigation(papers, paper.metadata.slug);
  const relatedNotes = getRelatedNotes(paper.metadata, papers);

  return (
    <Desktop
      initialHref="/research"
      contentByHref={{
        "/research": (
          <ReadingEntryShell
            backHref="/research"
            backLabel="← back to research"
            kind="research"
            metadata={paper.metadata}
            readingTime={readingTime}
            tableOfContents={tableOfContents}
            navigation={navigation}
            relatedNotes={relatedNotes}
          >
            <MdxContent source={paper.body} />
          </ReadingEntryShell>
        ),
      }}
    />
  );
}

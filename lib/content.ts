import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type {
  ContentEntry,
  ContentFrontmatter,
  ContentKind,
  ContentMetadata,
  ContentSummary,
} from "@/lib/content-types";

const contentRoot = path.join(process.cwd(), "content");
const mdxExtension = ".mdx";

const contentDirectories = {
  blogs: "blogs",
  work: "work",
  research: "research",
} satisfies Record<ContentKind, string>;

function getContentDirectory(kind: ContentKind): string {
  return path.join(contentRoot, contentDirectories[kind]);
}

function getSlugFromFilename(filename: string): string {
  return path.basename(filename, mdxExtension);
}

function isMdxFile(filename: string): boolean {
  return path.extname(filename) === mdxExtension;
}

async function readMdxFilenames(kind: ContentKind): Promise<string[]> {
  const directory = getContentDirectory(kind);
  const filenames = await fs.readdir(directory);

  return filenames.filter(isMdxFile);
}

function requireString(
  value: unknown,
  field: keyof ContentFrontmatter,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`frontmatter field "${field}" must be a non-empty string`);
  }

  return value;
}

function optionalString(
  value: unknown,
  field: keyof ContentFrontmatter,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return requireString(value, field);
}

function requireBoolean(
  value: unknown,
  field: keyof ContentFrontmatter,
): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`frontmatter field "${field}" must be a boolean`);
  }

  return value;
}

function optionalNumber(
  value: unknown,
  field: keyof ContentFrontmatter,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`frontmatter field "${field}" must be a finite number`);
  }

  return value;
}

function optionalStringArray(
  value: unknown,
  field: keyof ContentFrontmatter,
): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  return requireStringArray(value, field);
}

function requireStringArray(
  value: unknown,
  field: keyof ContentFrontmatter,
): string[] {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || item.trim().length === 0)
  ) {
    throw new Error(
      `frontmatter field "${field}" must be an array of non-empty strings`,
    );
  }

  return value;
}

function parseFrontmatter(
  frontmatter: Record<string, unknown>,
  fallbackSlug: string,
): ContentMetadata {
  const slug = optionalString(frontmatter.slug, "slug") ?? fallbackSlug;

  return {
    title: requireString(frontmatter.title, "title"),
    description: requireString(frontmatter.description, "description"),
    slug,
    date: requireString(frontmatter.date, "date"),
    tags: requireStringArray(frontmatter.tags, "tags"),
    coverImage: optionalString(frontmatter.coverImage, "coverImage"),
    published: requireBoolean(frontmatter.published, "published"),
    summary: requireString(frontmatter.summary, "summary"),
    order: optionalNumber(frontmatter.order, "order"),
    category: requireString(frontmatter.category, "category"),
    publication: optionalString(frontmatter.publication, "publication"),
    conference: optionalString(frontmatter.conference, "conference"),
    journal: optionalString(frontmatter.journal, "journal"),
    authors: optionalStringArray(frontmatter.authors, "authors"),
    status: optionalString(frontmatter.status, "status"),
    paperUrl: optionalString(frontmatter.paperUrl, "paperUrl"),
    codeUrl: optionalString(frontmatter.codeUrl, "codeUrl"),
    slidesUrl: optionalString(frontmatter.slidesUrl, "slidesUrl"),
    citation: optionalString(frontmatter.citation, "citation"),
    doi: optionalString(frontmatter.doi, "doi"),
  };
}

function sortContentEntries(a: ContentEntry, b: ContentEntry): number {
  const aOrder = a.metadata.order ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.metadata.order ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return b.metadata.date.localeCompare(a.metadata.date);
}

async function readContentFile(
  kind: ContentKind,
  filename: string,
): Promise<ContentEntry> {
  const filePath = path.join(getContentDirectory(kind), filename);
  const source = await fs.readFile(filePath, "utf8");
  const parsed = matter(source);

  return {
    metadata: parseFrontmatter(parsed.data, getSlugFromFilename(filename)),
    body: parsed.content.trim(),
  };
}

export async function getAllContent(
  kind: ContentKind,
  includeDrafts = false,
): Promise<ContentSummary[]> {
  const entries = await getAllContentEntries(kind, includeDrafts);

  return entries.map(({ metadata }) => ({ metadata }));
}

export async function getAllContentEntries(
  kind: ContentKind,
  includeDrafts = false,
): Promise<ContentEntry[]> {
  const filenames = await readMdxFilenames(kind);
  const entries = await Promise.all(
    filenames.map((filename) => readContentFile(kind, filename)),
  );

  return entries
    .filter((entry) => includeDrafts || entry.metadata.published)
    .sort(sortContentEntries);
}

export async function getContentBySlug(
  kind: ContentKind,
  slug: string,
  includeDrafts = false,
): Promise<ContentEntry | null> {
  const filenames = await readMdxFilenames(kind);
  const entries = await Promise.all(
    filenames.map((filename) => readContentFile(kind, filename)),
  );

  return (
    entries.find((entry) => {
      if (!includeDrafts && !entry.metadata.published) {
        return false;
      }

      return entry.metadata.slug === slug;
    }) ?? null
  );
}

export function getAllBlogs(includeDrafts = false): Promise<ContentSummary[]> {
  return getAllContent("blogs", includeDrafts);
}

export function getAllBlogEntries(
  includeDrafts = false,
): Promise<ContentEntry[]> {
  return getAllContentEntries("blogs", includeDrafts);
}

export function getBlogBySlug(
  slug: string,
  includeDrafts = false,
): Promise<ContentEntry | null> {
  return getContentBySlug("blogs", slug, includeDrafts);
}

export function getAllBuildNotes(
  includeDrafts = false,
): Promise<ContentSummary[]> {
  return getAllContent("work", includeDrafts);
}

export function getAllBuildNoteEntries(
  includeDrafts = false,
): Promise<ContentEntry[]> {
  return getAllContentEntries("work", includeDrafts);
}

export function getBuildNote(
  slug: string,
  includeDrafts = false,
): Promise<ContentEntry | null> {
  return getContentBySlug("work", slug, includeDrafts);
}

export function getAllResearch(
  includeDrafts = false,
): Promise<ContentSummary[]> {
  return getAllContent("research", includeDrafts);
}

export function getAllResearchEntries(
  includeDrafts = false,
): Promise<ContentEntry[]> {
  return getAllContentEntries("research", includeDrafts);
}

export function getResearch(
  slug: string,
  includeDrafts = false,
): Promise<ContentEntry | null> {
  return getContentBySlug("research", slug, includeDrafts);
}

export const contentKinds = ["blogs", "work", "research"] as const;

export type ContentKind = (typeof contentKinds)[number];

export type ContentFrontmatter = {
  title: string;
  description: string;
  slug?: string;
  date: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  summary: string;
  order?: number;
  category: string;
  publication?: string;
  conference?: string;
  journal?: string;
  authors?: string[];
  status?: string;
  paperUrl?: string;
  codeUrl?: string;
  slidesUrl?: string;
  citation?: string;
  doi?: string;
};

export type ContentMetadata = Omit<ContentFrontmatter, "slug"> & {
  slug: string;
};

export type ContentEntry = {
  metadata: ContentMetadata;
  body: string;
};

export type ContentSummary = {
  metadata: ContentMetadata;
};

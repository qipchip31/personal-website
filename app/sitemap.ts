import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllBlogs, getAllBuildNotes, getAllResearch } from "@/lib/content";
import { games } from "@/lib/play";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [notes, essays, papers] = await Promise.all([
    getAllBuildNotes(),
    getAllBlogs(),
    getAllResearch(),
  ]);
  const now = new Date();

  return [
    "",
    "/about",
    "/work",
    "/research",
    "/blogs",
    "/play",
    ...games.map((game) => game.href),
    ...notes.map((note) => `/work/${note.metadata.slug}`),
    ...essays.map((essay) => `/blogs/${essay.metadata.slug}`),
    ...papers.map((paper) => `/research/${paper.metadata.slug}`),
  ].map((route) => ({
    url: `${siteConfig.seo.url}${route}`,
    lastModified: now,
  }));
}

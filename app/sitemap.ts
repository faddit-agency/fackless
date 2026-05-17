import type { MetadataRoute } from "next";
import { getSitemapPosts, getSitemapResources } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "daily", priority: 1 },
  { url: `${SITE_URL}/news`, changeFrequency: "hourly", priority: 0.9 },
  { url: `${SITE_URL}/articles`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/resources`, changeFrequency: "weekly", priority: 0.85 },
  { url: `${SITE_URL}/community`, changeFrequency: "daily", priority: 0.85 },
  {
    url: `${SITE_URL}/community/questions`,
    changeFrequency: "daily",
    priority: 0.85,
  },
  {
    url: `${SITE_URL}/community/feedback`,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/community/networking`,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  { url: `${SITE_URL}/bootcamp`, changeFrequency: "weekly", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, resources] = await Promise.all([
    getSitemapPosts(),
    getSitemapResources(),
  ]);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const path =
      post.type === "article"
        ? `/articles/${post.slug ?? post.id}`
        : `/community/questions/${post.id}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: post.updated_at,
      changeFrequency: post.type === "article" ? "weekly" : "daily",
      priority: post.type === "article" ? 0.75 : 0.6,
    };
  });

  const resourceEntries: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${SITE_URL}/resources/${resource.id}`,
    lastModified: resource.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...STATIC_ROUTES, ...postEntries, ...resourceEntries];
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://hdr.kevinliu.studio/", changeFrequency: "monthly", priority: 1 }];
}

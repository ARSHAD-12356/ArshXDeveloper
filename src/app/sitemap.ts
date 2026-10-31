import type { MetadataRoute } from "next";
import { profile } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: profile.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
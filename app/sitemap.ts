import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://konbinicode.com";

  const locales = routing.locales as readonly string[];

  const entries = locales.map((locale) => {
    const url = `${baseUrl}/${locale}`;
    const languages: Record<string, string> = {};
    locales.forEach((l) => {
      languages[l] = `${baseUrl}/${l}`;
    });
    languages["x-default"] = baseUrl;

    return {
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages,
      },
    } satisfies MetadataRoute.Sitemap[0];
  });
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: locales.reduce(
        (acc, l) => {
          acc[l] = `${baseUrl}/${l}`;
          return acc;
        },
        {} as Record<string, string>
      ),
    },
  });

  return entries;
}

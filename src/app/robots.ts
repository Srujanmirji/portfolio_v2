import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://www.srujanmirji.in/sitemap.xml",
    host: "https://www.srujanmirji.in",
  };
}

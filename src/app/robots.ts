import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.animated.extend-ui.com/";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: "",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.animated.extend-ui.com/",
      lastModified: new Date(),
    },
    {
      url: "https://www.animated.extend-ui.com/pricing",
      lastModified: new Date(),
    },
    {
      url: "https://www.animated.extend-ui.com/privacy-policy",
      lastModified: new Date(),
    },
    {
      url: "https://www.animated.extend-ui.com/refund-policy",
      lastModified: new Date(),
    },
    {
      url: "https://www.animated.extend-ui.com/terms-of-service",
      lastModified: new Date(),
    },
    {
      url: "https://www.animated.extend-ui.com/dashboard",
      lastModified: new Date(),
    },
    {
      url: "https://www.animated.extend-ui.com/dashboard/account",
      lastModified: new Date(),
    },
    {
      url: "https://www.animated.extend-ui.com/dashboard/settings",
      lastModified: new Date(),
    },
  ];
}

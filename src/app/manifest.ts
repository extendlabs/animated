import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Animated",
    short_name: "Animated",
    description:
      "Create vivid, engaging recordings that showcase your code in motion.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#000000",
  };
}

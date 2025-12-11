import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Animated",
    short_name: "Animated",
    description:
      "Create engaging code recordings. Perfect for tutorials, docs, and sharing 'aha' moments.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#00000",
  };
}

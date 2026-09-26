import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AGENTICA — Agentic AI Periodic Table Game",
    short_name: "AGENTICA",
    description: "Understand, build, run, break and fix agentic AI systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3e7cc",
    theme_color: "#17211f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

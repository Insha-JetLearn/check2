import { createFileRoute } from "@tanstack/react-router";
import { LabApp } from "@/components/science-lab/LabApp";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "AI Science Lab — Interactive STEM Missions" },
      { name: "description", content: "Explore interactive volcano, electricity, gravity, rocket, DNA, submarine, and science quiz missions." },
      { property: "og:title", content: "AI Science Lab — Interactive STEM Missions" },
      { property: "og:description", content: "Run experiments, solve science challenges, and earn XP in a futuristic learning lab." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LabApp,
});

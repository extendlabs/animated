import {
  CodeXml,
  Earth,
  GalleryVerticalEnd,
  Images,
  Lock,
  Palette,
  Settings2,
  Terminal,
} from "lucide-react";

const features = [
  {
    name: "Themes",
    description:
      "Customize your presentations with beautiful themes. From default theme to 20+ premium options.",
    icon: Palette,
  },
  {
    name: "Full Control",
    description:
      "Your recordings, your rules. Host locally or share securely with your team. Complete privacy and ownership of your content.",
    icon: Lock,
  },
  {
    name: "Card Customization",
    description:
      "Fine-tune your card appearance with editable padding and radius.",
    icon: Settings2,
  },
  {
    name: "Backgrounds",
    description: "Choose from a variety of professional backgrounds.",
    icon: GalleryVerticalEnd,
  },
  {
    name: "Languages",
    description:
      "Support for multiple programming languages. Expand from basic to 20+ languages.",
    icon: CodeXml,
  },
  {
    name: "Slides",
    description: "Create stunning code presentations with multiple slides. ",
    icon: Images,
  },
];

export default function Features() {
  return (
    <section className="space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Simple Tools, Powerful Results
        </h2>
        <p className="mt-4 sm:text-lg">
          We've simplified code recording down to its essence. Every feature is
          thoughtfully designed to be intuitive yet powerful, helping you create
          professional demonstrations with ease.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative overflow-hidden rounded-lg border bg-background p-8 shadow hover:border-emerald-500"
          >
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8 text-emerald-500" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { backgroundOptions } from "@/constants/backgroundThemes";
import {
  CodeXml,
  GalleryVerticalEnd,
  Images,
  Lock,
  Palette,
  Settings2,
} from "lucide-react";
import Image from "next/image";
import { C, Go, JavaScript, Python, Rust, Swift } from "./icons";

const features = [
  {
    name: "Themes",
    description:
      "Customize your presentations with beautiful themes. From default theme to 20+ premium options.",
    icon: Palette,
    component: (
      <Image
        alt="themes"
        src={
          "https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPWm5UOnhB2dOPTlNM6RgCihsLzQy4bYIaUeHu"
        }
        width={1000}
        height={1000}
        className="rounded-2xl"
      />
    ),
  },
  {
    name: "Full Control",
    description:
      "Your recordings, your rules. Host locally or share securely with your team. Complete privacy and ownership of your content.",
    icon: Lock,
    component: (
      <Image
        alt="control"
        src={
          "https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRP7oEacNOe0NThrZ3Mo9qDQgGdvAuHisU68ySz"
        }
        width={1000}
        height={1000}
        className="rounded-2xl"
      />
    ),
  },
  {
    name: "Card Customization",
    description:
      "Fine-tune your card appearance with editable width and radius.",
    icon: Settings2,
    component: (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-muted-foreground">Width</span>
          <Slider min={0} max={100} step={1} value={[Number(50)]} />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Radius</span>
          <Slider min={0} max={35} step={1} value={[Number(15)]} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Line Index</span>
          <Switch defaultChecked />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Interval</span>
          <Slider min={0} max={100} step={1} value={[Number(50)]} />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Line duration</span>
          <Slider min={0} max={100} step={1} value={[Number(50)]} />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Token delay</span>
          <Slider min={0} max={100} step={1} value={[Number(50)]} />
        </div>
      </div>
    ),
  },
  {
    name: "Backgrounds",
    description: "Choose from a variety of professional backgrounds.",
    icon: GalleryVerticalEnd,
    component: (
      <div className="grid grid-cols-8 gap-2">
        {backgroundOptions.map(({ options }) =>
          options.map(({ value }) => (
            <div className="flex w-fit items-center gap-2">
              <span
                className="size-6 rounded-full"
                style={{ background: value }}
              />
            </div>
          )),
        )}
        <span className="col-span-5 flex items-end text-sm"> + more</span>
      </div>
    ),
  },
  {
    name: "Languages",
    description:
      "Support for multiple programming languages. Expand to 10+ languages.",
    icon: CodeXml,
    component: (
      <div className="grid grid-cols-3 gap-2">
        <JavaScript />
        <Rust />
        <Go />
        <Python />
        <Swift />
        <C />
      </div>
    ),
  },
  {
    name: "Slides",
    description: "Create stunning code presentations with multiple slides. ",
    icon: Images,
    component: (
      // <Image
      //   alt="slides"
      //   src={
      //     "https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPjvokFYE1x0U587iW4tSyzl26BkuHjcvN3ZaV"
      //   }
      //   width={1000}
      //   height={2000}
      //   className="rounded-2xl"
      // />
      <></>
    ),
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
      <div className="mx-auto mt-16 grid max-w-sm grid-cols-1 gap-6 text-gray-300 md:max-w-3xl md:grid-cols-2 md:grid-rows-3 xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3 xl:grid-rows-2">
        {features.map((feature) => (
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900 p-6 transition-all duration-500 ease-out hover:bg-emerald-500/10">
            <div className="">
              <div className="flex items-center gap-4">
                <feature.icon className="h-8 w-8 text-emerald-500" />
                <h3 className="font-semibold text-white">{feature.name}</h3>
              </div>
              <p className="mt-2">{feature.description}</p>
            </div>
            {}
            <div className="mt-4 w-full rounded-lg border-2 border-emerald-700 bg-emerald-900/10 p-4 shadow backdrop-blur-md">
              {feature.component}
            </div>
            {/* <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-900"></div> */}
          </div>
        ))}
      </div>
    </section>
  );
}

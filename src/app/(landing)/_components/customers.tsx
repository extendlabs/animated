import { LinkedIn, Meta, Reddit, XformerlyTwitter } from "./icons";

export default function Customers() {
  return (
    <section className="py-20">
      <div className="flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="max-w-[42rem] text-sm leading-normal text-zinc-400 sm:leading-8">
          {`Share it on many platforms.`}
        </p>
        <div className="flex items-center justify-center gap-8 pt-2">
          <XformerlyTwitter className="size-8 fill-white" />
          <Meta className="size-8 fill-white" />
          <LinkedIn className="size-8 text-white" />
          <Reddit className="size-8 fill-white" />
        </div>
      </div>
    </section>
  );
}

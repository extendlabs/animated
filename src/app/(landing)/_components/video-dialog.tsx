import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Play } from "lucide-react";

export function VideoDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative mt-16 max-w-screen-lg rounded-lg shadow-lg">
          <div className="group relative cursor-pointer rounded-xl bg-slate-500/20 p-2 ring-1 ring-slate-200/50 hover:backdrop-blur-lg">
            <Image
              src="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPSffPdKz4crUtnskQM6JR0f94vmwAdeE7WBpY"
              alt="screen"
              width={3818}
              height={2160}
              className="rounded-md border transition-all duration-200 ease-out group-hover:brightness-[0.8]"
            />
            <div>
              <Play className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-800 via-zinc-600 to-zinc-400 fill-white p-5 text-white ring-[20px] ring-gray-400/70 transition-all duration-200 ease-out group-hover:size-24 group-hover:ring-[10px]" />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="border-2 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
        </DialogHeader>
        {/* <div>
          <iframe
            src="https://xvylq80vkq.ufs.sh/f/d0hpkByvvVRPJ94VhKZdoSVxuY6UW8X2KsL4HanzvlmbEt0I"
            className="size-full rounded-2xl"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}

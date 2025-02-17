import React from "react";
import { FilmIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export const EmptyTab = ({ title, description, icon }: Props) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-4 border-zinc-800 pb-8 text-center">
      {icon}
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
};

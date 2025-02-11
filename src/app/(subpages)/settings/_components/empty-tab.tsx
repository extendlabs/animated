import React from 'react';
import { FilmIcon } from 'lucide-react';

type Props = {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const EmptyTab = ({ title, description, icon }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]  pb-8 text-center rounded-xl  border-4 border-zinc-800">
            {icon}
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-zinc-400">
                {description}
            </p>
        </div>
    );
};

export default EmptyTab;
import React from 'react';
import { CodeCard } from './code-card';
import { type DiffResult } from 'types/code-presentation.type';
import { cn } from '@/lib/utils';


type Props = {
    currentCode: string;
    currentSlide: number;
    diffMap: DiffResult | null;
};

export const RecordableCodeCard = ({
    currentCode,
    currentSlide,
    diffMap,
}: Props) => {
    return (
        <div className={cn(
            "flex justify-center items-center w-full"
        )}>
            <div className="w-full">
                <CodeCard
                    currentCode={currentCode}
                    currentSlide={currentSlide}
                    diffMap={diffMap}
                />
            </div>
        </div>
    );
};

export default RecordableCodeCard;
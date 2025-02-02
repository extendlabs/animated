import React from 'react';
import { CodeCard } from './code-card';
import { type DiffResult } from 'types/code-presentation.type';

type Props = {
    currentCode: string;
    currentSlide: number;
    diffMap: DiffResult | null;
    containerRef: React.RefObject<HTMLDivElement>;
};

export const RecordableCodeCard = ({
    currentCode,
    currentSlide,
    diffMap,
    containerRef,
}: Props) => {
    return (
        <div ref={containerRef}>
            <CodeCard
                currentCode={currentCode}
                currentSlide={currentSlide}
                diffMap={diffMap}
            />
        </div>
    );
};

export default RecordableCodeCard;
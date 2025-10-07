import { useEffect, useRef, useState } from 'preact/hooks';
import TimeLabels from './TimeLabels';
import VideoBlocks from './VideoBlocks';
import { useZoom } from '../hooks/useZoom'
import { useElementSize } from '../hooks/useElementSize';

export default function Timeline({ videos }) {
    const { zoom, zoomIn, zoomOut } = useZoom(1, 4, 1);
    const [viewIndex, setViewIndex] = useState(0);
    const containerRef = useRef(null);
    const { width } = useElementSize(containerRef);

    const getMaxViewIndex = (zoom) => {
        switch (zoom) {
            case 1: return 0;
            case 2: return 1;
            case 3: return 23;
            case 4: return 47;
            default: return 0;
        }
    };

    const maxViewIndex = getMaxViewIndex(zoom);

    // Reset viewIndex to 0 whenever zoom changes (to keep it in bounds)
    useEffect(() => {
        setViewIndex(0);
    }, [zoom]);

    const handlePrev = () => {
        setViewIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setViewIndex((prev) => Math.min(prev + 1, maxViewIndex));
    };

    return (
        <div class="w-full overflow-x-auto">
            <div class="flex items-center mb-2 justify-between">
                <div class="flex gap-2">
                    <button onClick={handlePrev} disabled={viewIndex === 0} class="bg-gray-200 px-2 py-1 rounded">←</button>
                    <button onClick={handleNext} disabled={viewIndex === maxViewIndex} class="bg-gray-200 px-2 py-1 rounded">→</button>
                </div>

                <div class="flex gap-2">
                    <button onClick={zoomOut} class="bg-gray-200 px-2 py-1 rounded">-</button>
                    <button onClick={zoomIn} class="bg-gray-200 px-2 py-1 rounded">+</button>
                </div>
                <span class="text-sm text-gray-600">
                    Zoom: {zoom} | View: {viewIndex + 1}/{maxViewIndex + 1}
                </span>
            </div>

            <div
                ref={containerRef}
                class={`relative border border-gray-300 bg-white min-w-[${width}px]`}
            >
                <TimeLabels zoom={zoom} viewIndex={viewIndex} width={width} />
                <VideoBlocks videos={videos} zoom={zoom} viewIndex={viewIndex} />
            </div>
        </div>
    );
}

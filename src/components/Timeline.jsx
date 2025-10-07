import { useEffect, useRef, useState } from 'preact/hooks';
import TimeLabels from './TimeLabels';
import VideoBlocks from './VideoBlocks';
import { useZoom } from '../hooks/useZoom'
import { useElementSize } from '../hooks/useElementSize';
import { DateTime } from 'luxon';

export default function Timeline({ videos }) {
    const [viewIndex, setViewIndex] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);

    const { zoom, zoomIn, zoomOut } = useZoom(1, 4, 1, selectedTime, setViewIndex);
    const containerRef = useRef(null);
    const { width } = useElementSize(containerRef);

    let startHour = 0;
    let endHour = 24;

    if (zoom === 1) {
        startHour = 0;
        endHour = 24;
    } else if (zoom === 2) {
        startHour = viewIndex * 12;    // 0 or 12
        endHour = startHour + 12;
    } else if (zoom === 3) {
        startHour = viewIndex * 6;     // 0, 6, 12, 18
        endHour = startHour + 6;
    } else if (zoom === 4) {
        startHour = viewIndex;         // 0 → 23
        endHour = startHour + 1;
    }

    const viewStart = startHour * 60; // in minutes
    const viewEnd = endHour * 60;
    const totalDuration = viewEnd - viewStart;

    const pixelsPerMinute = width / totalDuration;

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
    // useEffect(() => {
    //     setViewIndex(0);
    // }, [zoom]);

    useEffect(() => {
        if (selectedTime == null) return;

        let newViewIndex = 0;

        if (zoom === 1) {
            newViewIndex = 0;
        } else if (zoom === 2) {
            newViewIndex = Math.floor(selectedTime / (12 * 60));
        } else if (zoom === 3) {
            newViewIndex = Math.floor(selectedTime / (6 * 60));
        } else if (zoom === 4) {
            newViewIndex = Math.floor(selectedTime / 60);
        }

        setViewIndex(newViewIndex);
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
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const clickedMinutes = viewStart + x / pixelsPerMinute;
                    setSelectedTime(clickedMinutes);
                }}
                class={`relative border border-gray-300 bg-white min-w-[${width}px]`}
            >
                <TimeLabels zoom={zoom} viewIndex={viewIndex} width={width} />
                <VideoBlocks videos={videos} zoom={zoom} viewIndex={viewIndex} width={width} />


                {selectedTime !== null && (
                    <>
                        <div
                            class="absolute top-0 bottom-0 w-px bg-red-500"
                            style={{
                                left: `${(selectedTime - viewStart) * pixelsPerMinute}px`
                            }}
                        />
                        <div
                            class="absolute"
                            style={{
                                left: `${(selectedTime - viewStart) * pixelsPerMinute}px`,
                                top: '-20px'
                            }}
                        >
                            <span class="text-xs bg-white border px-1 rounded shadow">
                                {DateTime.fromObject({ hour: 0, minute: 0 }).plus({ minutes: selectedTime }).toFormat('HH:mm')}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

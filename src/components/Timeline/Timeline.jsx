import { useEffect, useRef, useState } from 'preact/hooks';
import { DateTime } from 'luxon';
import TimeLabels from './TimeLabels';
import VideoBlocks from './VideoBlocks';
import Marker from './Marker';
import { useZoom } from '../../hooks/useZoom';
import { useElementSize } from '../../hooks/useElementSize';

export default function Timeline({ videos }) {
    const [viewIndex, setViewIndex] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);

    const { zoom, zoomIn, zoomOut } = useZoom(1, 4, 1, selectedTime, setViewIndex);
    const containerRef = useRef(null);
    const { width } = useElementSize(containerRef);

    const [isCutMode, setIsCutMode] = useState(false);
    const [cutSelections, setCutSelections] = useState([]);
    const [cutStart, setCutStart] = useState(null);

    const [hoverTime, setHoverTime] = useState(null);

    let startHour = 0;
    let endHour = 24;

    if (zoom === 1) {
        startHour = 0;
        endHour = 24;
    } else if (zoom === 2) {
        startHour = viewIndex * 12
        endHour = startHour + 12;
    } else if (zoom === 3) {
        startHour = viewIndex * 6;
        endHour = startHour + 6;
    } else if (zoom === 4) {
        startHour = viewIndex;
        endHour = startHour + 1;
    }

    const viewStart = startHour * 60;
    const viewEnd = endHour * 60;
    const totalDuration = viewEnd - viewStart;
    const pixelsPerMinute = width / totalDuration;

    const getMaxViewIndex = (zoom) => {
        switch (zoom) {
            case 1: return 0;
            case 2: return 1;
            case 3: return 3; // 24 hours / 6
            case 4: return 23;
            default: return 0;
        }
    };

    const maxViewIndex = getMaxViewIndex(zoom);

    useEffect(() => {
        if (selectedTime == null) return;

        let newViewIndex = 0;
        if (zoom === 1) newViewIndex = 0;
        else if (zoom === 2) newViewIndex = Math.floor(selectedTime / (12 * 60));
        else if (zoom === 3) newViewIndex = Math.floor(selectedTime / (6 * 60));
        else if (zoom === 4) newViewIndex = Math.floor(selectedTime / 60);

        setViewIndex(newViewIndex);
    }, [zoom]);

    const handlePrev = () => {
        setViewIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setViewIndex((prev) => Math.min(prev + 1, maxViewIndex));
    };

    const handleCut = () => {

    }


    function isValidSelection(selection, videos) {
        return videos.some(video => {
            const videoStart = DateTime.fromISO(video.start);
            const videoEnd = DateTime.fromISO(video.end);

            // Normalize times to minutes since midnight
            const videoStartMin = videoStart.hour * 60 + videoStart.minute;
            const videoEndMin = videoEnd.hour * 60 + videoEnd.minute;

            // Check if any part of the selection overlaps this video
            return (
                (selection.start >= videoStartMin && selection.start < videoEndMin) ||
                (selection.end > videoStartMin && selection.end <= videoEndMin) ||
                (selection.start <= videoStartMin && selection.end >= videoEndMin)
            );
        });
    }

    function isValidTimePoint(timeInMinutes, videos) {
        return videos.some(video => {
            const videoStart = DateTime.fromISO(video.start);
            const videoEnd = DateTime.fromISO(video.end);

            const videoStartMin = videoStart.hour * 60 + videoStart.minute;
            const videoEndMin = videoEnd.hour * 60 + videoEnd.minute;

            return timeInMinutes >= videoStartMin && timeInMinutes < videoEndMin;
        });
    }


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

                <div class="flex gap-2">
                    <button
                        onClick={() => {
                            setIsCutMode(prev => !prev);
                            setCutStart(null); // reset any in-progress selection
                        }}
                        class={`bg-${isCutMode ? 'red' : 'gray'}-200 px-2 py-1 rounded`}
                    >
                        ✂️ Cut {isCutMode ? '(On)' : '(Off)'}
                    </button>

                    {isCutMode && (
                        <button
                            onClick={() => {
                                setIsCutMode(false);
                                setCutStart(null);
                                setCutSelections([]); // ✅ Clear all cut selections

                            }}
                            class="bg-yellow-200 px-2 py-1 rounded"
                        >
                            ❌ Cancel Cut
                        </button>
                    )}
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

                    if (isCutMode) {
                        if (!isValidTimePoint(clickedMinutes, videos)) {
                            alert("Invalid selection: click must be within video area.");
                            return;
                        }

                        if (cutStart === null) {
                            // First valid click
                            setCutStart(clickedMinutes);
                        } else {
                            const newSelection = {
                                start: Math.min(cutStart, clickedMinutes),
                                end: Math.max(cutStart, clickedMinutes),
                            };

                            if (isValidSelection(newSelection, videos)) {
                                setCutSelections(prev => [...prev, newSelection]);
                                setCutStart(null);
                            } else {
                                alert("Invalid selection: range must be within video area.");
                                setCutStart(null);
                            }
                        }
                    }



                    // if (isCutMode) {
                    //     // Cut Mode Logic
                    //     if (cutStart === null) {
                    //         setCutStart(clickedMinutes); // First click
                    //     } else {
                    //         const newSelection = {
                    //             start: Math.min(cutStart, clickedMinutes),
                    //             end: Math.max(cutStart, clickedMinutes),
                    //         };

                    //         if (isValidSelection(newSelection, videos)) {
                    //             setCutSelections(prev => [...prev, newSelection]);
                    //             setCutStart(null); // reset for next selection
                    //         } else {
                    //             // invalid selection
                    //             alert("Invalid selection: must be within video areas.");
                    //             setCutStart(null);
                    //         }
                    //     }
                    // } else {
                    //     // Normal click to set marker
                    //     // setSelectedTime(clickedMinutes);
                    // }
                }}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const hoveredMinutes = viewStart + x / pixelsPerMinute;
                    setHoverTime(hoveredMinutes);
                }}
                onMouseLeave={() => {
                    setHoverTime(null);
                }}
                class={`relative border border-gray-300 bg-white min-w-[${width}px]`}
            >
                <TimeLabels zoom={zoom} viewIndex={viewIndex} width={width} />
                <VideoBlocks videos={videos} zoom={zoom} viewIndex={viewIndex} width={width} />

                {selectedTime !== null && (
                    <Marker selectedTime={selectedTime} viewStart={viewStart} pixelsPerMinute={pixelsPerMinute} />
                )}

                {cutSelections.map((sel, index) => {
                    const left = (sel.start - viewStart) * pixelsPerMinute;
                    const width = (sel.end - sel.start) * pixelsPerMinute;

                    return (
                        <div
                            key={index}
                            class="absolute top-0 h-full bg-blue-200 opacity-50 pointer-events-none"
                            style={{
                                left: `${left}px`,
                                width: `${width}px`
                            }}
                        />
                    );
                })}

                {hoverTime !== null && (
                    <>
                        <div
                            class="absolute top-0 bottom-0 w-px bg-gray-300 pointer-events-none"
                            style={{
                                left: `${(hoverTime - viewStart) * pixelsPerMinute}px`,
                            }}
                        />
                        <div
                            class="absolute top-0 transform -translate-x-1/2 text-xs text-gray-600 bg-white px-1 border border-gray-300 rounded shadow"
                            style={{
                                left: `${(hoverTime - viewStart) * pixelsPerMinute}px`,
                            }}
                        >
                            {DateTime.fromObject({ hour: 0, minute: 0 }).plus({ minutes: hoverTime }).toFormat("HH:mm")}
                        </div>
                    </>
                )}


            </div>
        </div>
    );
}

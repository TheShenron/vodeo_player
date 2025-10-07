// components/TimeLabels.js
import { getTimeSegments } from '../utils/timeUtils';

export default function TimeLabels({ zoom, width, viewIndex }) {
    const times = getTimeSegments(zoom, viewIndex);
    console.log(times)
    console.log(width)
    return (
        <div class="flex border-b text-xs text-gray-500 select-none relative">
            {times.map((time, idx) => (
                <div
                    key={idx}
                    class="flex flex-col items-center"
                    style={{ width: `${60 / zoom}px` }}
                >
                    {time.minute === 0 ? (
                        <span>{time.toFormat('H')}</span>
                    ) : (
                        <div class="h-2 w-px bg-gray-400 opacity-40" />
                    )}
                </div>
            ))}
        </div>
    );
}

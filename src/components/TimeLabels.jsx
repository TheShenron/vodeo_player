// components/TimeLabels.js
import { getTimeSegments } from '../utils/timeUtils';

export default function TimeLabels({ zoom, viewIndex, width }) {
    const times = getTimeSegments(zoom, viewIndex);

    const start = times[0];
    const end = times[times.length - 1];
    const totalMinutes = end.diff(start, 'minutes').minutes;

    const pixelsPerMinute = width / totalMinutes;
    const segmentDuration = times[1].diff(times[0], 'minutes').minutes;
    const segmentWidth = segmentDuration * pixelsPerMinute;

    return (
        <div class="flex border-b text-xs text-gray-500">
            {times.map((time, idx) => (
                <div
                    key={idx}
                    class="flex flex-col items-center"
                    style={{ width: `${segmentWidth}px` }}
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

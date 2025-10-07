import { DateTime } from 'luxon';

export default function VideoBlocks({ videos, zoom, viewIndex, width }) {
    let startHour, endHour;

    if (zoom === 1) {
        startHour = 0;
        endHour = 24;
    } else if (zoom === 2) {
        startHour = viewIndex * 12;
        endHour = startHour + 12;
    } else if (zoom === 3) {
        startHour = viewIndex * 6;
        endHour = startHour + 6;
    } else if (zoom === 4) {
        startHour = viewIndex;
        endHour = startHour + 1;
    }


    const startMinutes = startHour * 60;
    const endMinutes = endHour * 60;
    const totalDuration = endMinutes - startMinutes;
    const pixelsPerMinute = width / totalDuration;

    return (
        <div class="relative h-12 bg-gray-50" style={{ width: `${width}px` }}>
            {videos.map((video) => {
                const start = DateTime.fromISO(video.start);
                const end = DateTime.fromISO(video.end);
                const videoStartMinutes = start.hour * 60 + start.minute;
                const videoEndMinutes = end.hour * 60 + end.minute;

                // Skip videos outside current view
                if (videoEndMinutes <= startMinutes || videoStartMinutes >= endMinutes) {
                    return null;
                }

                // Clamp to view bounds
                const clampedStart = Math.max(videoStartMinutes, startMinutes);
                const clampedEnd = Math.min(videoEndMinutes, endMinutes);
                const duration = clampedEnd - clampedStart;

                const left = (clampedStart - startMinutes) * pixelsPerMinute;
                const width = duration * pixelsPerMinute;

                return (
                    <div
                        key={video.id}
                        class="absolute top-1 h-8 bg-blue-500 text-white text-xs px-2 py-1 overflow-hidden whitespace-nowrap"
                        style={{ left: `${left}px`, width: `${width}px` }}
                    >
                        {video.name}
                    </div>
                );
            })}
        </div>
    );
}

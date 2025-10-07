// components/VideoBlocks.js
import { DateTime } from 'luxon';

export default function VideoBlocks({ videos, zoom }) {
    const pixelsPerMinute = zoom;

    return (
        <div class="relative h-12 bg-gray-50">
            {videos.map(video => {
                const start = DateTime.fromISO(video.start);
                const end = DateTime.fromISO(video.end);
                const startMinutes = start.hour * 60 + start.minute;
                const duration = end.diff(start, 'minutes').minutes;

                const left = startMinutes * pixelsPerMinute;
                const width = duration * pixelsPerMinute;

                return (
                    <div
                        key={video.id}
                        class="absolute top-1 h-8 bg-blue-500 text-white text-xs px-2 py-1 overflow-hidden"
                        style={{ left: `${left}px`, width: `${width}px` }}
                    >
                        {/* {video.name} */}
                    </div>
                );
            })}
        </div>
    );
}

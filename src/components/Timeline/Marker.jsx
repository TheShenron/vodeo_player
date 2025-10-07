import { DateTime } from 'luxon';

export default function Marker({ selectedTime, viewStart, pixelsPerMinute }) {
    const left = (selectedTime - viewStart) * pixelsPerMinute;

    return (
        <>
            <div
                class="absolute top-0 bottom-0 w-px bg-red-500"
                style={{ left: `${left}px` }}
            />
            <div
                class="absolute"
                style={{ left: `${left}px`, top: '-20px' }}
            >
                <span class="text-xs bg-white border px-1 rounded shadow">
                    {DateTime.fromObject({ hour: 0, minute: 0 }).plus({ minutes: selectedTime }).toFormat('HH:mm')}
                </span>
            </div>
        </>
    );
}

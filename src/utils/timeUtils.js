import { DateTime } from 'luxon';

export function getTimeSegments(zoom, viewIndex = 0) {
    let startHour = 0;
    let endHour = 24;
    let segmentDuration = 10; // default 10 min
    let segmentsPerHour = 6;

    if (zoom === 1) {
        // Entire day, 10-min segments
        segmentDuration = 10;
        segmentsPerHour = 6;
        startHour = 0;
        endHour = 24;
    } else if (zoom === 2) {
        // Show 12-hour block per view
        segmentDuration = 5;
        segmentsPerHour = 12;
        startHour = viewIndex * 12;           // 0 or 12
        endHour = startHour + 12;
    } else if (zoom === 3) {
        // Show 1-hour block per view
        segmentDuration = 5;
        segmentsPerHour = 12;
        startHour = viewIndex * 6;                // 0 → 23
        endHour = startHour + 6;
    } else if (zoom === 4) {
        // Show 1-hour block per view
        segmentDuration = 1;
        segmentsPerHour = 60;
        startHour = viewIndex;                // 0 → 23
        endHour = startHour + 1;
    }

    const totalSegments = (endHour - startHour) * segmentsPerHour;

    const times = [];
    let current = DateTime.fromObject({ hour: startHour, minute: 0 });

    for (let i = 0; i <= totalSegments; i++) {
        times.push(current);
        current = current.plus({ minutes: segmentDuration });
    }

    return times;
}

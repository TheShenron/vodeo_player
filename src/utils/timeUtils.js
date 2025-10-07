import { DateTime } from 'luxon';

export function getTimeSegments(zoom, viewIndex) {
    let startHour = 0;
    let endHour = 24;
    let segmentDuration = 10;

    if (zoom === 1) {
        startHour = 0;
        endHour = 24;
        segmentDuration = 10;
    } else if (zoom === 2) {
        startHour = viewIndex * 12;
        endHour = startHour + 12;
        segmentDuration = 5;
    } else if (zoom === 3) {
        startHour = viewIndex * 6;
        endHour = startHour + 6;
        segmentDuration = 5;
    } else if (zoom === 4) {
        startHour = viewIndex;
        endHour = startHour + 1;
        segmentDuration = 1;
    }

    const times = [];
    const start = DateTime.fromObject({ hour: startHour, minute: 0 });
    const end = DateTime.fromObject({ hour: endHour, minute: 0 });
    let current = start;

    while (current < end) {
        times.push(current);
        current = current.plus({ minutes: segmentDuration });
    }

    return times;
}

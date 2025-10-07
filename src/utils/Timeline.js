export function getViewIndexForSelectedTime(selectedTime, zoom) {
    if (selectedTime == null) return 0;

    if (zoom === 1) return 0;
    if (zoom === 2) return Math.floor(selectedTime / (12 * 60));
    if (zoom === 3) return Math.floor(selectedTime / (6 * 60));
    if (zoom === 4) return Math.floor(selectedTime / 60);

    return 0;
}

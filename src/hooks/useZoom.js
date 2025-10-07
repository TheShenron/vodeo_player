// hooks/useZoom.js
import { useState } from 'preact/hooks';
import { getViewIndexForSelectedTime } from '../utils/Timeline'

export function useZoom(minZoom = 1, maxZoom = 4, initial = 1, selectedTime, setViewIndex) {
    const [zoom, setZoom] = useState(initial);

    const zoomIn = () => {
        const newZoom = Math.min(zoom + 1, maxZoom);
        setZoom(prev => Math.min(prev + 1, maxZoom))

        const newViewIndex = getViewIndexForSelectedTime(selectedTime, newZoom);
        setViewIndex(newViewIndex);

    };
    const zoomOut = () => {
        const newZoom = Math.min(zoom + 1, maxZoom);
        setZoom(prev => Math.max(prev - 1, minZoom))

        const newViewIndex = getViewIndexForSelectedTime(selectedTime, newZoom);
        setViewIndex(newViewIndex);
    };

    return { zoom, zoomIn, zoomOut };
}

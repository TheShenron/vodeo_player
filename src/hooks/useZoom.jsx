import { useState } from 'preact/hooks';

export function useZoom(min = 1, max = 4, initial = 1, selectedTime, setViewIndex) {
    const [zoom, setZoom] = useState(initial);

    const zoomIn = () => {
        setZoom((z) => Math.min(max, z + 1));
    };

    const zoomOut = () => {
        setZoom((z) => Math.max(min, z - 1));
    };

    return { zoom, zoomIn, zoomOut };
}

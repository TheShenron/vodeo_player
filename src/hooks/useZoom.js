// hooks/useZoom.js
import { useState } from 'preact/hooks';

export function useZoom(minZoom = 1, maxZoom = 4, initial = 1) {
    const [zoom, setZoom] = useState(initial);

    const zoomIn = () => setZoom(prev => Math.min(prev + 1, maxZoom));
    const zoomOut = () => setZoom(prev => Math.max(prev - 1, minZoom));

    return { zoom, zoomIn, zoomOut };
}

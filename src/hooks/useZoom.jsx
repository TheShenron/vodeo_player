import { useEffect, useState } from 'preact/hooks';

export function useZoom(min = 1, max = 4, initial = 1, selectedTime, setViewIndex) {
    const [zoom, setZoom] = useState(initial);

    const zoomIn = () => {
        setZoom((z) => Math.min(max, z + 1));
    };

    const zoomOut = () => {
        setZoom((z) => Math.max(min, z - 1));
    };


    // useEffect(() => {
    //     if (selectedTime == null) return;

    //     let newViewIndex = 0;
    //     if (zoom === 1) newViewIndex = 0;
    //     else if (zoom === 2) newViewIndex = Math.floor(selectedTime / (12 * 60));
    //     else if (zoom === 3) newViewIndex = Math.floor(selectedTime / (6 * 60));
    //     else if (zoom === 4) newViewIndex = Math.floor(selectedTime / 60);

    //     setViewIndex(newViewIndex);
    // }, [zoom, selectedTime]);

    return { zoom, zoomIn, zoomOut };
}

// hooks/useManualElementSize.js
import { useState, useEffect } from 'preact/hooks';

export function useElementSize(ref) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const updateSize = () => {
        if (ref.current) {
            setSize({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    };

    useEffect(() => {
        updateSize();

        window.addEventListener('resize', updateSize);
        return () => {
            window.removeEventListener('resize', updateSize);
        };
    }, [ref]);

    return size;
}

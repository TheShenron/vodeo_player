import { useState, useEffect } from 'preact/hooks';

export function useElementSize(ref) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;

        const updateSize = () => {
            const { width, height } = ref.current.getBoundingClientRect();
            setSize({ width, height });
        };

        updateSize();

        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [ref]);

    return size;
}

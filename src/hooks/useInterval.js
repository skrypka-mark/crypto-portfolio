import { useEffect, useRef } from 'react';

export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    savedCallback.current = callback;
    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };
        if(delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};
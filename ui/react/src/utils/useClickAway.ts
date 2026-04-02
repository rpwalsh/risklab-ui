import { useEffect, useRef } from 'react';

export function useClickAway<T extends HTMLElement = HTMLElement>(
  onClickAway: (event: MouseEvent | TouchEvent) => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway(event);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onClickAway]);

  return ref;
}

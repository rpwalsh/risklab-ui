import React, { useCallback, useRef } from 'react';

type RefCallback<T> = (instance: T | null) => void;

export function useMergedRef<T>(...refs: (React.Ref<T> | undefined | null)[]): RefCallback<T> {
  const savedRefs = useRef(refs);
  savedRefs.current = refs;

  return useCallback((instance: T | null) => {
    for (const ref of savedRefs.current) {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = instance;
      }
    }
  }, []);
}

import { useEffect, useRef } from "react";

const useRafLoop = (callback: () => void) => {
  const callbackRef = useRef<() => void | null>();
  callbackRef.current = callback;

  return useEffect(() => {
    let canceled = false;
    const rafCallback = () => {
      if (!canceled) {
        requestAnimationFrame(rafCallback);
        if (callbackRef.current) {
          callbackRef.current();
        }
      }
    };
    requestAnimationFrame(rafCallback);
    return () => {
      canceled = true;
    };
  }, []);
};

export default useRafLoop;

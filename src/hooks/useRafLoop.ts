import { useEffect, useRef } from "react";

const useRafLoop = (callback: (frameIndex: number) => void) => {
  const callbackRef = useRef<(frameIndex: number) => void | null>();
  callbackRef.current = callback;

  return useEffect(() => {
    let canceled = false;
    let frameIndex = 0;
    const rafCallback = () => {
      if (!canceled) {
        requestAnimationFrame(rafCallback);
        if (callbackRef.current) {
          callbackRef.current(frameIndex);
          frameIndex = (frameIndex + 1) % 60;
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

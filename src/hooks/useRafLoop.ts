import { useEffect, useRef } from "react";

const useRafLoop = (
  callback: (frameIndex: number, framesPerSecond: number) => void
) => {
  const callbackRef = useRef<
    (frameIndex: number, framesPerSecond: number) => void | null
  >();
  callbackRef.current = callback;

  return useEffect(() => {
    let canceled = false;
    let frameIndex = 0;
    let lastFrameAt = performance.now();
    const rafCallback = (now: DOMHighResTimeStamp) => {
      if (!canceled) {
        requestAnimationFrame(rafCallback);
        const delta = now - lastFrameAt;
        if (delta < 1000 / 65) {
          // Skip the frame, it's too early, and we need to speed up to catch up
          return;
        }
        const fps = 1000 / delta;
        if (callbackRef.current) {
          callbackRef.current(frameIndex, fps);
        }
        lastFrameAt = now;
        frameIndex = (frameIndex + 1) % 60;
      }
    };
    requestAnimationFrame(rafCallback);
    return () => {
      canceled = true;
    };
  }, []);
};

export default useRafLoop;

import React, { useRef } from "react";

const useCanvasContext = (): [
  React.MutableRefObject<HTMLCanvasElement | null>,
  React.MutableRefObject<CanvasRenderingContext2D | null>,
  (canvas: HTMLCanvasElement | null) => void
] => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const canvasRefCallback = (newCanvas: HTMLCanvasElement | null) => {
    if (!newCanvas || newCanvas === canvasRef.current) {
      // Everything is already up to date
      return;
    }
    canvasRef.current = newCanvas;
    contextRef.current = newCanvas.getContext("2d");
  };

  return [canvasRef, contextRef, canvasRefCallback];
};

export default useCanvasContext;

import React, { useMemo } from "react";
import useCanvasContext from "../hooks/useCanvasContext";
import useRafLoop from "../hooks/useRafLoop";

// Todo: better volume estimation (for now just the average)
const getVolume = (frequencies: Uint8Array) => {
  let volume = 0;
  frequencies.forEach((frequency) => (volume += frequency));
  return volume / frequencies.length;
};

const AudioPreview: React.FC<{
  audioTrack: MediaStreamTrack;
  width?: number;
  height?: number;
  backgroundColor: string;
  barColor: string;
}> = ({ audioTrack, backgroundColor, barColor, width = 250, height = 120 }) => {
  const [, contextRef, canvasRefCallback] = useCanvasContext();

  const audioAnalyzer = useMemo(() => {
    const audioContext = new AudioContext();

    const stream = new MediaStream();
    stream.addTrack(audioTrack);
    const source = audioContext.createMediaStreamSource(stream);

    const audioAnalyzer = audioContext.createAnalyser();
    audioAnalyzer.fftSize = 256;
    source.connect(audioAnalyzer);

    return audioAnalyzer;
  }, [audioTrack]);

  useRafLoop(() => {
    if (!contextRef.current || audioTrack.readyState === "ended") {
      return;
    }
    const buffer = new Uint8Array(audioAnalyzer.frequencyBinCount);
    audioAnalyzer.getByteFrequencyData(buffer);
    const volume = getVolume(buffer);

    const barHeight = (volume / 256) * height;
    const barWidth = 10;
    const context = contextRef.current;
    context.drawImage(context.canvas, -barWidth, 0);
    context.fillStyle = backgroundColor;
    context.fillRect(width - barWidth, height, barWidth, -height);
    context.fillStyle = barColor;
    context.fillRect(width - barWidth, height, barWidth, -barHeight);
  });
  return (
    <canvas
      ref={canvasRefCallback}
      width={width}
      height={height}
      style={{ width: "100%", height: "auto", maxWidth: 200 }}
    />
  );
};

export default AudioPreview;

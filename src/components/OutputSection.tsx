import React, { useEffect } from "react";
import { Stack } from "@chakra-ui/core";
import useRafLoop from "../hooks/useRafLoop";
import useCanvasContext from "../hooks/useCanvasContext";
import { FakeMediaRecorder, Size, VideoLayer } from "../types/MediaTypes";
import { TrackEditorState } from "../hooks/useTrackEditor";
import { downloadBlob } from "../helpers/fileHelpers";
import { combineAudio } from "../helpers/mediaHelpers";

const getColorForFrameRate = (frameRate: number) => {
  const normalizedFrameRate = frameRate / 60;
  const red = (1 - normalizedFrameRate) * 255;
  const green = normalizedFrameRate * 255;
  const blue = 64;
  const alpha = Math.max(0.1, 1 - normalizedFrameRate);
  return `rgba(${red},${green},${blue}, ${alpha})`;
};

const getPositionForLayer = (
  outputSize: Size,
  { anchor, size: videoSize }: VideoLayer
) => {
  const [verticalDescriptor, horizontalDescriptor] = anchor.split("-");
  let x = 0;
  let y = 0;

  switch (verticalDescriptor) {
    case "top":
      y = 0;
      break;
    case "middle":
      y = Math.floor((outputSize.height - videoSize.height) / 2);
      break;
    case "bottom":
      y = Math.floor(outputSize.height - videoSize.height);
      break;
  }

  switch (horizontalDescriptor) {
    case "left":
      x = 0;
      break;
    case "middle":
      x = Math.floor((outputSize.width - videoSize.width) / 2);
      break;
    case "right":
      x = Math.floor(outputSize.width - videoSize.width);
      break;
  }

  return { x, y };
};

const startRecordingTest = (
  editorState: TrackEditorState,
  combinedVideoTrack: MediaStreamTrack
) => {
  const recordingStream = new MediaStream();

  recordingStream.addTrack(combinedVideoTrack);
  const outputAudioStream = combineAudio(editorState.audioLayers);
  const [outputAudioTrack] = outputAudioStream.getTracks();
  recordingStream.addTrack(outputAudioTrack);

  //@ts-ignore
  const mediaRecorder: FakeMediaRecorder = new MediaRecorder(recordingStream, {
    mimeType: "video/webm; codecs=vp9",
  });
  mediaRecorder.ondataavailable = (event) => {
    combinedVideoTrack.stop();
    const chunk = event.data;
    const blob = new Blob([chunk], { type: "video/webm" });
    downloadBlob(blob, `${editorState.output.fileName}.webm`);
  };
  mediaRecorder.start();
  return () => {
    console.log("Stopping recording");
    mediaRecorder.stop();
  };
};

const fpsCanvasSize = { width: 1200, height: 60 };

const OutputSection: React.FC<{
  editorState: TrackEditorState;
}> = ({ editorState }) => {
  const [canvasRef, contextRef, canvasRefCallBack] = useCanvasContext();
  const [
    fpsCanvasRef,
    fpsContextRef,
    fpsCanvasRefCallBack,
  ] = useCanvasContext();

  useEffect(() => {
    if (editorState.isRecording) {
      console.log("Start recording");
      // @ts-ignore Capture stream not yet supported in TS
      const canvasStream: MediaStream = canvasRef.current!.captureStream(30);

      const canvasTracks = canvasStream.getTracks();
      if (canvasTracks.length !== 1) {
        throw new Error(
          `Expected one track from canvas stream but got ${canvasTracks.length}`
        );
      }
      const [outputVideoTrack] = canvasTracks;
      return startRecordingTest(editorState, outputVideoTrack);
    }
    return () => {
      console.log("Stopping non-existent recording");
    };
    // Although all of the editorState is used by this hook, it should only
    // re-execute when isRecording changes (and so stale values are acceptable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState.isRecording]);

  useRafLoop((frameIndex, framesPerSecond) => {
    if (!contextRef.current || frameIndex % 2) {
      return;
    }
    for (let index = editorState.videoLayers.length - 1; index >= 0; index--) {
      const videoLayer = editorState.videoLayers[index];
      const video = editorState.videoMap[videoLayer.track.id];
      const { x, y } = getPositionForLayer(editorState.output, videoLayer);
      if (videoLayer.naturalSize.width === videoLayer.size.width) {
        contextRef.current!.drawImage(video, x, y);
      } else {
        const { width, height } = videoLayer.size;
        contextRef.current!.drawImage(video, x, y, width, height);
      }
    }
    if (fpsContextRef.current && fpsCanvasRef.current) {
      const barWidth = 10;
      fpsContextRef.current.drawImage(fpsCanvasRef.current, -(barWidth + 2), 0);
      fpsContextRef.current.fillStyle = "#1A202C";
      fpsContextRef.current.fillRect(
        fpsCanvasSize.width,
        0,
        -barWidth,
        fpsCanvasSize.height
      );
      fpsContextRef.current.fillStyle = getColorForFrameRate(framesPerSecond);
      fpsContextRef.current.fillRect(
        fpsCanvasSize.width,
        fpsCanvasSize.height,
        -barWidth,
        -framesPerSecond
      );
    }
  });

  return (
    <Stack
      as="section"
      p={2}
      direction="column"
      justifyContent="center"
      justifySelf="center"
      alignSelf="center"
      spacing={2}
      shouldWrapChildren
    >
      <canvas
        ref={canvasRefCallBack}
        width={editorState.output.width}
        height={editorState.output.height}
        className="preview-canvas"
      />
      <canvas
        ref={fpsCanvasRefCallBack}
        width={fpsCanvasSize.width}
        height={fpsCanvasSize.height}
        className="fps-canvas"
        title="Frame rate"
      />
    </Stack>
  );
};

export default OutputSection;

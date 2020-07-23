import React, { useEffect, useMemo } from "react";
import { Grid, Heading } from "@chakra-ui/core";
import useRafLoop from "../hooks/useRafLoop";
import useCanvasContext from "../hooks/useCanvasContext";
import {
  AnnotatedTrack,
  FakeMediaRecorder,
  Size,
  VideoLayer,
} from "../types/MediaTypes";
import { trackToVideo } from "../helpers/videoHelpers";
import { TrackEditorState } from "../hooks/useTrackEditor";
import { downloadBlob } from "../helpers/fileHelpers";
import { combineAudio } from "../helpers/mediaHelpers";

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

// Todo: Switch to using a shared track-to-video cache
const useTracksAsVideos = (videoTracks: AnnotatedTrack[]) =>
  useMemo(
    () =>
      videoTracks.map((annotatedTrack) => trackToVideo(annotatedTrack.track)),
    [videoTracks]
  );

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

const OutputSection: React.FC<{
  editorState: TrackEditorState;
}> = ({ editorState }) => {
  const [canvasRef, contextRef, canvasRefCallBack] = useCanvasContext();
  const videos = useTracksAsVideos(editorState.videoLayers);

  useEffect(() => {
    if (editorState.isRecording) {
      console.log("Start recording");
      // Capture stream not yet supported in ts
      // @ts-ignore
      const canvasStream: MediaStream = canvasRef.current!.captureStream();

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
    for (let index = videos.length - 1; index >= 0; index--) {
      const video = videos[index];
      const videoLayer = editorState.videoLayers[index];
      const { x, y } = getPositionForLayer(editorState.output, videoLayer);
      if (videoLayer.naturalSize.width === videoLayer.size.width) {
        contextRef.current!.drawImage(video, x, y);
      } else {
        const { width, height } = videoLayer.size;
        contextRef.current!.drawImage(video, x, y, width, height);
      }
    }

    contextRef.current!.font = "30px Arial";
    contextRef.current!.fillText(framesPerSecond.toFixed(3), 16, 32);
  });

  return (
    <Grid as="section" templateRows="auto 1fr" p={2}>
      <Heading as="h2" size="lg">
        Output
      </Heading>
      <Grid justifyContent="center" alignItems="center">
        <canvas
          ref={canvasRefCallBack}
          width={editorState.output.width || 192}
          height={editorState.output.height || 108}
          className="preview-canvas"
        />
      </Grid>
    </Grid>
  );
};

export default OutputSection;

import React, { useMemo } from "react";
import { Grid, Heading } from "@chakra-ui/core";
import useRafLoop from "../hooks/useRafLoop";
import useCanvasContext from "../hooks/useCanvasContext";
import { AnnotatedTrack } from "../types/MediaTypes";
import { trackToVideo } from "../helpers/videoHelpers";

// Todo: Switch to using a shared track-to-video cache
const useTracksAsVideos = (videoTracks: AnnotatedTrack[]) =>
  useMemo(
    () =>
      videoTracks.map((annotatedTrack) => trackToVideo(annotatedTrack.track)),
    [videoTracks]
  );

const PreviewSection: React.FC<{
  audioTracks: AnnotatedTrack[];
  videoTracks: AnnotatedTrack[];
  width: number | null;
  height: number | null;
}> = ({ videoTracks, width, height }) => {
  const [, contextRef, canvasRefCallBack] = useCanvasContext();
  const videos = useTracksAsVideos(videoTracks);

  useRafLoop(() => {
    if (!contextRef.current) {
      return;
    }
    videos.forEach((video) => contextRef.current!.drawImage(video, 0, 0));
  });

  return (
    <Grid as="section" templateRows="auto 1fr" p={2}>
      <Heading as="h2" size="lg">
        Preview
      </Heading>
      <Grid justifyContent="center" alignItems="center">
        <canvas
          ref={canvasRefCallBack}
          width={width || 192}
          height={height || 108}
          className="preview-canvas"
        />
      </Grid>
    </Grid>
  );
};

export default PreviewSection;

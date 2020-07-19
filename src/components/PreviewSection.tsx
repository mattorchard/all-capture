import React from "react";
import { Grid, Heading } from "@chakra-ui/core";
import useRafLoop from "../hooks/useRafLoop";
import useCanvasContext from "../hooks/useCanvasContext";
import useTracksAsVideos from "../hooks/useTracksAsVideos";

const PreviewSection: React.FC<{
  audioTracks: MediaStreamTrack[];
  videoTracks: MediaStreamTrack[];
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

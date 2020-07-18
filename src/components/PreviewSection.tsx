import React from "react";
import { Grid, Heading } from "@chakra-ui/core";

const PreviewSection: React.FC<{
  audioTracks: AudioTrack[];
  videoTracks: VideoTrack[];
}> = () => {
  return (
    <Grid as="section" templateRows="auto 1fr" p={2}>
      <Heading as="h2" size="lg">
        Preview
      </Heading>
      <Grid justifyContent="center" alignItems="center">
        <canvas width="192" height="108" className="preview-canvas" />
      </Grid>
    </Grid>
  );
};

export default PreviewSection;

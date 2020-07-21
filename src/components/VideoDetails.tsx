import React from "react";
import VideoPreview from "./VideoPreview";
import AnchorChooser from "./AnchorChooser";
import { Badge, Stack } from "@chakra-ui/core";
import { AnnotatedTrack } from "../types/MediaTypes";

const VideoDetails: React.FC<{
  annotatedTrack: AnnotatedTrack;
  as: React.ElementType;
}> = ({ annotatedTrack, as }) => (
  <Stack as={as} isInline spacing={4} shouldWrapChildren>
    <VideoPreview videoTrack={annotatedTrack.track} />
    <Stack align="flex-start" flexWrap="wrap">
      <Badge variantColor="pink">{annotatedTrack.source}</Badge>
      {annotatedTrack.deviceInfo && (
        <Badge variantColor="orange">
          {annotatedTrack.deviceInfo.label || "Unlabeled Device"}
        </Badge>
      )}
      <Badge variantColor="teal">
        {annotatedTrack.settings.width}x{annotatedTrack.settings.height}
      </Badge>
      <Badge variantColor="cyan">{annotatedTrack.settings.frameRate}fps</Badge>
    </Stack>

    <AnchorChooser selectedValue="middle-middle" onAnchorChange={console.log} />
  </Stack>
);

export default VideoDetails;

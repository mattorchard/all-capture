import React from "react";
import VideoPreview from "./VideoPreview";
import AnchorChooser from "./AnchorChooser";
import { Badge, Stack } from "@chakra-ui/core";
import { AnchorValue, Size, VideoLayer } from "../types/MediaTypes";
import VideoSizeSelector from "./VideoSizeSelector";

const VideoDetails: React.FC<{
  videoLayer: VideoLayer;
  as: React.ElementType;
  onAnchorChange: (anchor: AnchorValue) => void;
  onSizeChange: (size: Size) => void;
  disablePreview?: boolean;
}> = ({
  videoLayer,
  as,
  onSizeChange,
  onAnchorChange,
  disablePreview = false,
}) => (
  <Stack as={as} isInline spacing={4} shouldWrapChildren marginBottom={4}>
    <VideoPreview videoTrack={videoLayer.track} isDisabled={disablePreview} />

    <AnchorChooser
      selectedValue={videoLayer.anchor}
      onAnchorChange={onAnchorChange}
    />

    <VideoSizeSelector
      naturalWidth={videoLayer.settings.width || 1920}
      naturalHeight={videoLayer.settings.height || 1080}
      onSizeChange={onSizeChange}
    />

    <Stack align="flex-start" flexWrap="wrap">
      <Badge variantColor="pink">{videoLayer.source}</Badge>
      {videoLayer.deviceInfo && (
        <Badge variantColor="orange">
          {videoLayer.deviceInfo.label || "Unlabeled Device"}
        </Badge>
      )}
      <Badge variantColor="teal">
        {videoLayer.settings.width}x{videoLayer.settings.height}
      </Badge>
      <Badge variantColor="cyan">{videoLayer.settings.frameRate}fps</Badge>
    </Stack>
  </Stack>
);

export default VideoDetails;
